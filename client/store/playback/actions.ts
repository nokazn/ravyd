import { Actions } from 'typed-vuex';

import { PlaybackState } from './state';
import { PlaybackGetters } from './getters';
import { PlaybackMutations } from './mutations';
import { REPEAT_STATE_LIST } from '~/constants';
import { SpotifyAPI, ZeroToHundred } from '~~/types';

export type PlaybackActions = {
  transferPlayback: (params?: {
    deviceId?: string
    play?: boolean
    update?: boolean
  }) => Promise<void>
  getActiveDeviceList: () => Promise<void>
  setCustomContext: (params: {
    contextUri?: string
    trackUriList: string[]
    trackIndex?: number
  }) => void
  resetCustomContext: (uri: string | null) => void
  getCurrentPlayback: () => Promise<SpotifyAPI.Player.CurrentPlayback | undefined>
  pollCurrentPlayback: (timeout?: number) => void
  play: (payload?: ({
    contextUri: string
    trackUriList?: undefined
  } | {
    contextUri?: undefined
    trackUriList: string[]
  }) & {
    offset?: {
      uri: string
      position?: undefined
    } | {
      uri?: undefined
      position: number
    }
  }) => Promise<void>
  pause: () => Promise<void>
  seek: (payload: {
    positionMs: number
    currentPositionMs?: number
  }) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
  shuffle: () => Promise<void>
  repeat: () => Promise<void>
  volume: ({ volumePercent }: { volumePercent: ZeroToHundred }) => Promise<void>
  mute: () => Promise<void>
  checkTrackSavedState: (trackIds?: string) => Promise<void>
  modifyTrackSavedState: ({ trackId, isSaved }: {
    trackId?: string
    isSaved: boolean
  }) => void
  resetPlayback: () => void
};

export type RootActions = {
  'playback/transferPlayback': PlaybackActions['transferPlayback']
  'playback/getActiveDeviceList': PlaybackActions['getActiveDeviceList']
  'playback/setCustomContext': PlaybackActions['setCustomContext']
  'playback/resetCustomContext': PlaybackActions['resetCustomContext']
  'playback/getCurrentPlayback': PlaybackActions['getCurrentPlayback']
  'playback/pollCurrentPlayback': PlaybackActions['pollCurrentPlayback']
  'playback/play': PlaybackActions['play']
  'playback/pause': PlaybackActions['pause']
  'playback/seek': PlaybackActions['seek']
  'playback/next': PlaybackActions['next']
  'playback/previous': PlaybackActions['previous']
  'playback/shuffle': PlaybackActions['shuffle']
  'playback/repeat': PlaybackActions['repeat']
  'playback/volume': PlaybackActions['volume']
  'playback/mute': PlaybackActions['mute']
  'playback/checkTrackSavedState': PlaybackActions['checkTrackSavedState']
  'playback/modifyTrackSavedState': PlaybackActions['modifyTrackSavedState']
  'playback/resetPlayback': PlaybackActions['resetPlayback']
};

// プレイヤーを操作した後に polling するまでの初回の timeout
const DEFAULT_TIMEOUT = 500;

const actions: Actions<PlaybackState, PlaybackActions, PlaybackGetters, PlaybackMutations> = {
  /**
   * 再生するデバイスを変更し、update が指定されればデバイス一覧も更新
   */
  async transferPlayback({ state, commit, dispatch }, params) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    // 指定されなければこのデバイス
    const deviceId = params?.deviceId ?? state.deviceId;
    if (deviceId == null) return;

    const updateDeviceInfo = async () => {
      // update が指定された場合は必ずデバイスのリストを取得し直す
      const update = params?.update;
      const { deviceList } = state;
      const activeDevice = deviceList.find((device) => device.id === deviceId);
      if (update || activeDevice == null) {
        // デバイスのリストを取得しなおす
        await dispatch('getActiveDeviceList');
      } else {
        // 再生されているデバイスの isActive を true にする
        const activeDeviceList: SpotifyAPI.Device[] = deviceList.map((device) => ({
          ...device,
          is_active: device.id === deviceId,
        }));

        commit('SET_DEVICE_LIST', activeDeviceList);
      }
    };

    // play が指定されなかった場合は、デバイス内の状態を維持し、false が指定された場合は現在の状態を維持
    this.$spotify.player.transferPlayback({
      deviceId,
      play: params?.play ?? state.isPlaying,
    }).then(async () => {
      commit('SET_ACTIVE_DEVICE_ID', deviceId);

      await updateDeviceInfo();
      // 他のデバイスに変更した場合
      if (deviceId !== state.deviceId) {
        dispatch('getCurrentPlayback');
      }
    }).catch((err: Error) => {
      console.error({ err });
      dispatch('player/disconnectPlayer', undefined, { root: true });
      dispatch('player/initPlayer', undefined, { root: true });
    });
  },

  /**
   * デバイス一覧とデバイスのボリュームを取得
   */
  async getActiveDeviceList({ commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const { devices } = await this.$spotify.player.getActiveDeviceList();
    const deviceList = devices ?? [];
    const activeDevice = deviceList.find((device) => device.is_active);
    const volumePercent = activeDevice != null
      ? activeDevice.volume_percent
      : 100;

    commit('SET_DEVICE_LIST', deviceList);
    commit('SET_VOLUME_PERCENT', { volumePercent });

    if (activeDevice?.id != null) {
      commit('SET_ACTIVE_DEVICE_ID', activeDevice.id);
    }
  },

  /**
   * 再生するコンテキストを手動でセット
   */
  setCustomContext({ commit }, { contextUri, trackUriList, trackIndex }) {
    if (contextUri != null) {
      commit('SET_CUSTOM_CONTEXT_URI', contextUri);
    }
    commit('SET_CUSTOM_TRACK_URI_LIST', trackUriList);
    commit('SET_TRACK_INDEX', trackIndex);
  },

  /**
   * Web Playback SDK から取得できる場合は再生するコンテキストをリセット
   */
  resetCustomContext({ commit }, uri) {
    if (uri != null) {
      commit('SET_CUSTOM_CONTEXT_URI', undefined);
      commit('SET_CUSTOM_TRACK_URI_LIST', undefined);
      // プレイリストを再生する場合は setCustomContext で設定したイデックスを保持したいのでパス
      if (!uri.includes('playlist')) {
        commit('SET_TRACK_INDEX', undefined);
      }
    }
  },

  /**
   * @todo
   * このリクエストではエピソードを再生中でもコンテンツの内容は取得できない
   * Web Playback SDK では取得できるので、このデバイスで再生中の場合はそちらから取得できる
   */
  async getCurrentPlayback({ commit, dispatch }) {
    // currentTrack と durationMs を設定
    const setTrack = (
      item: SpotifyAPI.Track | SpotifyAPI.Episode | null,
      currentTrackId: string | undefined,
    ) => {
      // @todo episode 再生中だと null になる
      const track: Spotify.Track | undefined = item?.type === 'track'
        ? {
          ...item,
          media_type: 'audio',
        }
        : undefined;

      // このデバイスで再生中でアイテムの内容が取得できなかった場合は Playback SDK の情報を信頼してパスする
      if (track == null && this.$getters()['playback/isThisAppPlaying']) return;

      const trackId = track?.id;
      // trackId 変わったときだけチェック
      if (trackId != null && trackId !== currentTrackId) {
        dispatch('checkTrackSavedState', trackId);
      }

      commit('SET_CURRENT_TRACK', track);
      commit('SET_DURATION_MS', item?.duration_ms);
    };

    // アイテムの情報以外を設定
    const setPlayback = (playbackState: SpotifyAPI.Player.CurrentPlayback): void => {
      if (!playbackState) return;

      commit('SET_IS_PLAYING', playbackState.is_playing);
      commit('SET_CONTEXT_URI', playbackState.context?.uri);
      commit('SET_IS_SHUFFLED', playbackState.shuffle_state === 'on');
      commit('SET_DISALLOWS', playbackState.actions.disallows);
      commit('SET_POSITION_MS', playbackState.progress_ms ?? 0);

      const deviceId = playbackState.device.id;
      const { deviceId: currentDeviceId } = this.$state().playback;
      // このデバイスで再生中の場合は Web Playback SDK から取得するのでパス
      if (deviceId == null || deviceId !== currentDeviceId) {
        commit('SET_NEXT_TRACK_LIST', []);
        commit('SET_PREVIOUS_TRACK_LIST', []);
      }
    };

    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return undefined;

    const {
      deviceId,
      activeDeviceId: currentActiveDeviceId,
      trackId: currentTrackId,
    } = this.$state().playback;
    // const hasTrack = this.$getters()['playback/hasTrack'];
    const market = this.$getters()['auth/userCountryCode'];
    const playbackState = await this.$spotify.player.getCurrentPlayback({ market });

    // 何らかのエラー (i.e.トークンの期限切れなど) が発生し、再生状況が取得できなかった場合
    if (playbackState == null) return undefined;

    // デバイスが見つからないなどの理由で再生状況が取得できない場合
    if (playbackState === '') {
      // @todo 複数タブ開いた場合はデバイスが消失する場合がある?
      await dispatch('transferPlayback', {
        play: false,
        update: true,
      });

      // 他のデバイスからこのデバイスに変更した場合はトーストを表示
      if (deviceId !== currentActiveDeviceId) {
        this.$toast.show('primary', '再生していたデバイスが見つからないため、このデバイスをアクティブにします。');
      }
    } else {
      setTrack(playbackState.item, currentTrackId);
      setPlayback(playbackState);

      const activeDeviceId = playbackState.device.id;
      // アクティブなデバイスのデータに不整合がある場合はデバイス一覧を取得し直す
      if (activeDeviceId !== currentActiveDeviceId) {
        dispatch('getActiveDeviceList')
          .then(() => {
            this.$toast.show('primary', 'デバイスの変更を検知しました。');
          });
      }
    }

    return playbackState;
  },

  /**
   * getCurrentPlayback を定期的に実行する
   * firstTimeout が指定された場合は、現在のタイマーを削除して、firstTimeout 後 (または1トラックの再生が終わってトラックが変わった後) に polling を開始する
   */
  pollCurrentPlayback({ commit, dispatch }, firstTimeout) {
    // callback を アイテムが変わった後か、timeout ?? regularPeriod 後に実行
    const setTimer = (callback: () => Promise<void>, timeout?: number) => {
      const isThisAppPlaying = this.$getters()['playback/isThisAppPlaying'];
      const remainingTimeMs = this.$getters()['playback/remainingTimeMs'];
      const hasTrack = this.$getters()['playback/hasTrack'];
      const { isPlaying } = this.$state().playback;

      // @todo 設定で間隔設定できるようにしたい
      // timeout が指定されない場合は、このデバイスで再生中の場合は30秒、そうでなければ10秒
      const nextTimeout = timeout ?? (isThisAppPlaying
        ? 30 * 1000
        : 10 * 1000);
      // トラックがセットされていて再生中の場合、曲を再生しきって 500ms の方が先に来ればそれを採用
      const timer = setTimeout(callback, hasTrack && isPlaying
        ? Math.min(remainingTimeMs + 500, nextTimeout)
        : nextTimeout);

      commit('SET_POLLING_PLAYBACK_TIMER', timer);
    };

    const handler = async () => {
      // getCurrentPlayback する前に再生中のアイテムの情報を保持していていたか
      const previousHasTrack = this.$getters()['playback/hasTrack'];
      const playbackState = await dispatch('getCurrentPlayback');

      // 何らかのエラー (i.e.トークンの期限切れなど) が発生し、再生状況が取得できなかった場合は普通にタイマーを設定
      if (playbackState == null) {
        setTimer(handler);
        return;
      }

      // @todo 無限にリトライしちゃう
      const retryTimeout = 2000;
      // デバイスが見つからないなどの理由で再生状況が取得できない場合はリトライ
      if (playbackState === '') {
        setTimer(handler, retryTimeout);
        return;
      }

      // 再生中のアイテムの情報を保持していて、エピソード以外でアイテムが取得できなかった場合はリトライ
      const shouldRetry = previousHasTrack
        && playbackState.item == null
        && playbackState.currently_playing_type !== 'episode';

      setTimer(handler, shouldRetry
        ? retryTimeout
        : undefined);
    };

    // firstTimeout ms 経過後、再帰的に getCurrentPlayback を実行
    setTimer(handler, firstTimeout);
  },

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * offset.position は playlist を再生する場合のみ?
   */
  async play({
    state,
    getters,
    commit,
    dispatch,
  }, payload?) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('resuming') && payload == null) {
      commit('SET_IS_PLAYING', true);
      return;
    }

    const currentPositionMs = state.positionMs;
    const currentTrackUri = state.trackUri;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;

    // uri を指定していない場合
    const isNotUriPassed = contextUri == null && trackUriList == null;
    // offset.uri で指定された uri が同じ場合か、trackUriList と offset.position で指定された uri が同じ場合
    const isRestartingTracks = (
      currentTrackUri != null
      && currentTrackUri === offset?.uri
    ) || (
      trackUriList != null
      && offset?.position != null
      && currentTrackUri === trackUriList[offset.position]
    );

    // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止を解除
    await this.$spotify.player.play(isNotUriPassed || isRestartingTracks
      ? { positionMs: currentPositionMs }
      : {
        contextUri,
        trackUriList,
        offset,
      })
      .then(() => {
        commit('SET_IS_PLAYING', true);

        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、再生できません。');

        dispatch('pollCurrentPlayback', 0);
      });
  },

  async pause({ getters, commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('pausing')) {
      commit('SET_IS_PLAYING', false);
      return;
    }

    await this.$spotify.player.pause()
      .then(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('warning', 'エラーが発生しました。');

        dispatch('pollCurrentPlayback', 0);
      }).finally(() => {
        // エラーが発生しても表示は停止させる
        commit('SET_IS_PLAYING', false);
      });
  },

  async seek({
    state,
    getters,
    commit,
    dispatch,
  }, { positionMs, currentPositionMs }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('seeking')) return;

    // Playback SDK からの通知が来ない場合が偶にあるので先に変更しておく
    commit('SET_POSITION_MS', positionMs);
    const positionMsOfCurrentState = state.positionMs;

    await this.$spotify.player.seek({ positionMs })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生しました。');

        // 現在の position に戻す
        commit('SET_POSITION_MS', currentPositionMs ?? positionMsOfCurrentState);
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  async next({ getters, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('skipping_next')) return;

    await this.$spotify.player.next()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、次の曲を再生できません。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  async previous({ getters, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('skipping_prev')) return;

    await this.$spotify.player.previous()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、前の曲を再生できません。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  async shuffle({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    if (getters.isDisallowed('toggling_shuffle')) return;

    const { isShuffled } = state;
    const nextIsShuffled = !isShuffled;

    await this.$spotify.player.shuffle({ state: nextIsShuffled })
      .then(() => {
        commit('SET_IS_SHUFFLED', nextIsShuffled);
      }).catch((err: Error) => {
        console.error({ err });
        this.$toast.show('warning', 'エラーが発生し、シャッフルの状態を変更できませんでした。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * リピートの状態を変更
   */
  async repeat({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    // 初回読み込み時は undefined
    if (state.repeatMode == null
      || getters.isDisallowed('toggling_repeat_context')
      || getters.isDisallowed('toggling_repeat_track')) return;

    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;

    await this.$spotify.player.repeat({ state: REPEAT_STATE_LIST[nextRepeatMode] })
      .then(() => {
        commit('SET_REPEAT_MODE', nextRepeatMode);
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('warning', 'エラーが発生し、シャッフルの状態を変更できませんでした。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * ボリュームの変更
   */
  async volume({
    state,
    getters,
    commit,
    dispatch,
  }, { volumePercent }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const { volumePercent: currentVolumePercent } = state;
    if (currentVolumePercent === volumePercent) return;

    await this.$spotify.player.volume({ volumePercent })
      .then(() => {
        commit('SET_VOLUME_PERCENT', { volumePercent });
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、ボリュームが変更できませんでした。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * ミュートにする
   */
  async mute({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const {
      isMuted,
      volumePercent: currentVolumePercent,
    } = state;
    const nextMuteState = !isMuted;
    if (currentVolumePercent === 0) return;

    const volumePercent = nextMuteState
      ? 0
      : currentVolumePercent;

    await this.$spotify.player.volume({ volumePercent })
      .then(() => {
        commit('SET_IS_MUTED', nextMuteState);
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、ボリュームをミュートにできませんでした。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * セットされているトラックの保存状態を確認する
   */
  async checkTrackSavedState({ state, commit, dispatch }, trackId?) {
    const isAuthorized = await dispatch('auth/confirmAuthState', undefined, { root: true });
    if (!isAuthorized) return;

    const id = trackId ?? state.trackId;
    if (id == null) return;

    const [isSavedTrack] = await this.$spotify.library.checkUserSavedTracks({
      trackIdList: [id],
    });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },

  modifyTrackSavedState({ state, commit }, { trackId, isSaved }) {
    if (state.trackId == null || state.trackId !== trackId) return;

    commit('SET_IS_SAVED_TRACK', isSaved);
  },

  resetPlayback({ commit }) {
    commit('SET_DEVICE_ID', undefined);
    commit('SET_ACTIVE_DEVICE_ID', undefined);
    commit('SET_DEVICE_LIST', []);
    commit('SET_CUSTOM_CONTEXT_URI', undefined);
    commit('SET_CUSTOM_TRACK_URI_LIST', undefined);
    commit('SET_CURRENT_TRACK', undefined);
    commit('SET_NEXT_TRACK_LIST', []);
    commit('SET_PREVIOUS_TRACK_LIST', []);
    commit('SET_IS_SAVED_TRACK', false);
    commit('SET_IS_PLAYING', false);
    commit('SET_CONTEXT_URI', undefined);
    commit('SET_POSITION_MS', 0);
    commit('SET_DURATION_MS', undefined);
    commit('SET_DISABLED_PLAYING_FROM_BEGINING', false);
    commit('SET_IS_SHUFFLED', false);
    commit('SET_REPEAT_MODE', 0);
    commit('SET_DISALLOWS', {});
    commit('SET_VOLUME_PERCENT', { volumePercent: 0 });
    commit('SET_IS_MUTED', false);
  },
};

export default actions;
