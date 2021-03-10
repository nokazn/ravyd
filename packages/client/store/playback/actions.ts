import type { VuexActions } from 'typed-vuex';
import type { AxiosError } from 'axios';

import type { SpotifyAPI, ZeroToHundred } from 'shared/types';
import { nextRepeatState } from '~/services/converter';
import type { State, Mutations, Getters } from './types';
import type { App } from '~/entities';

interface TransferParams {
  deviceId?: string;
  play?: false;
  update?: true;
}
interface CustomContextParams {
  contextUri?: string;
  trackUriList: string[];
}
type PlayParams = {
  context: string | string[];
  offset?: {
    uri: string;
    position?: undefined;
  } | {
    uri?: undefined;
    position: number;
  };
  track?: App.MinimumTrack & { index?: number; };
}
interface SeekParams {
  positionMs: number;
  currentPositionMs?: number;
}
interface VolumeParams {
  volumePercent: ZeroToHundred;
}
interface ModifyTrackSavedStateParams {
  trackId?: string;
  isSaved: boolean;
}

export type Actions = {
  transferPlayback: (params?: TransferParams) => Promise<void>;
  getDeviceList: () => Promise<void>;
  updateDeviceList: (activeDevice: SpotifyAPI.Device) => Promise<void>;
  setCustomContext: (params: CustomContextParams) => void;
  resetCustomContext: (uri: string | null) => void;
  getCurrentPlayback: () => Promise<SpotifyAPI.Player.CurrentPlayback | undefined>;
  pollCurrentPlayback: (timeout?: number) => void;
  play: (params?: PlayParams) => Promise<void>;
  pause: () => Promise<void>;
  seek: (params: SeekParams) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  shuffle: () => Promise<void>;
  repeat: () => Promise<void>;
  volume: (params: VolumeParams) => Promise<void>;
  mute: () => Promise<void>;
  checkTrackSavedState: (trackIds: string | undefined | null) => Promise<void>;
  modifyTrackSavedState: (params: ModifyTrackSavedStateParams) => void;
  resetPlayback: () => void;
};

// プレイヤーを操作した後に polling するまでの初回の timeout
const DEFAULT_TIMEOUT = 500;

const actions: VuexActions<State, Actions, Getters, Mutations> = {
  /**
   * 再生するデバイスを変更し、update が指定されればデバイス一覧も更新
   */
  async transferPlayback({ state, commit, dispatch }, params) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    const thisDeviceId = state.deviceId;
    // 指定されなければこのデバイスに変更
    const deviceId = params?.deviceId ?? thisDeviceId;
    if (deviceId == null) return;

    const device = state.deviceList.find((d) => d.id === deviceId);
    // play が指定されなかった場合は、デバイス内の状態を維持し、false が指定された場合は現在の状態を維持
    const play = params?.play ?? state.isPlaying;
    await this.$spotify.player.transferPlayback({ deviceId, play })
      .then(async () => {
        commit('SET_ACTIVE_DEVICE_ID', deviceId);
        if (params?.update) {
          // デバイスのリストを取得しなおす
          await dispatch('getDeviceList');
          return;
        }
        if (device != null) {
          await dispatch('updateDeviceList', device);
        }
        // 他のデバイスに変更した場合タイマーをセットする
        if (deviceId !== thisDeviceId) {
          dispatch('pollCurrentPlayback', 1000);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('プレイヤーをアクティブにできませんでした。');
      });
  },

  /**
   * デバイス一覧とデバイスのボリュームを取得
   */
  async getDeviceList({ commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    const deviceList = (await this.$spotify.player.getDeviceList()).devices ?? [];
    commit('SET_DEVICE_LIST', deviceList);
    const activeDevice = deviceList.find((device) => device.is_active);
    if (activeDevice != null) {
      // activeDevice がなく、このデバイスで再生する場合は localStorage で永続化されてる volumePercent が採用される
      commit('SET_VOLUME_PERCENT', { volumePercent: activeDevice.volume_percent });
      if (activeDevice.id != null) {
        commit('SET_ACTIVE_DEVICE_ID', activeDevice.id);
      }
    }
  },

  /**
   * デバイス一覧を更新
   */
  async updateDeviceList({ state, commit, dispatch }, activeDevice) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    // 変更するデバイスのボリュームを取得
    const getVolumePercent = async (
      deviceId: string | null,
      deviceList: SpotifyAPI.Device[],
    ): Promise<ZeroToHundred | undefined> => {
      // 違うデバイスで再生する場合
      if (deviceId != null && deviceId !== state.deviceId) {
        return deviceList.find((device) => device.is_active)?.volume_percent;
      }
      // TODO: 初期化直後だと deviceList のボリュームの値が 100% になっちゃうのでプレイヤーから取得
      const volume = await this.$getters()['player/playbackPlayer']?.getVolume();
      return volume != null
        ? volume * 100 as ZeroToHundred
        : undefined;
    };

    // 再生されているデバイスの isActive を true にする
    const deviceList: SpotifyAPI.Device[] = state.deviceList.map((device) => {
      const is_active = device.id === activeDevice.id;
      return is_active
        ? { ...activeDevice, is_active }
        : { ...device, is_active };
    });
    commit('SET_DEVICE_LIST', deviceList);
    const volumePercent = await getVolumePercent(activeDevice.id, deviceList);
    if (volumePercent != null) {
      commit('SET_VOLUME_PERCENT', { volumePercent });
    }
  },

  /**
   * 再生するコンテキストを手動でセット
   */
  setCustomContext({ commit }, { contextUri, trackUriList }) {
    if (contextUri != null) {
      commit('SET_CUSTOM_CONTEXT_URI', contextUri);
    }
    commit('SET_CUSTOM_TRACK_URI_LIST', trackUriList);
  },

  /**
   * Web Playback SDK から取得できる場合は再生するコンテキストをリセット
   */
  resetCustomContext({ commit }, uri) {
    if (uri != null) {
      commit('SET_CUSTOM_CONTEXT_URI', undefined);
      commit('SET_CUSTOM_TRACK_URI_LIST', undefined);
    }
  },

  /**
   * TODO
   * このリクエストではエピソードを再生中でもコンテンツの内容は取得できない
   * Web Playback SDK では取得できるので、このデバイスで再生中の場合はそちらから取得できる
   */
  async getCurrentPlayback({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return undefined;
    }

    // currentTrack と durationMs を設定
    const setTrack = (
      item: SpotifyAPI.Track | SpotifyAPI.Episode | null,
      currentTrackId: string | undefined,
    ) => {
      // TODO: episode 再生中だと null になる
      const track: Spotify.Track | undefined = item?.type === 'track'
        ? { ...item, media_type: 'audio' }
        : undefined;
      // このデバイスで再生中でアイテムの内容が取得できなかった場合は Playback SDK の情報を信頼してパスする
      if (track == null && getters.deviceState === 'self') return;

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
      commit('SET_IS_SHUFFLED', playbackState.shuffle_state);
      commit('SET_DISALLOWS', playbackState.actions.disallows);
      commit('SET_POSITION_MS', playbackState.progress_ms ?? 0);
      const deviceId = playbackState.device.id;
      // このデバイスで再生中の場合は Web Playback SDK から取得するのでパス
      if (deviceId == null || deviceId !== state.deviceId) {
        commit('SET_NEXT_TRACK_LIST', []);
        commit('SET_PREVIOUS_TRACK_LIST', []);
      }
    };

    const {
      activeDeviceId: currentActiveDeviceId,
      track: currentTrack,
    } = state;
    // TODO: 複数タブ開いた場合はデバイスが消失する場合がある?
    const playbackState = await this.$spotify.player.getCurrentPlayback({});
    // デバイスがアクティブでなくなったとき空文字が返る
    commit('SET_IS_PLAYBACK_SLEEP', playbackState === '');
    // エラー (i.e.トークンの期限切れなど) が発生し、再生状況が取得できなかった場合か、デバイスが見つからない場合
    if (!playbackState) return playbackState;

    setTrack(playbackState.item, currentTrack?.id);
    setPlayback(playbackState);
    dispatch('updateDeviceList', playbackState.device);
    // アクティブなデバイスのデータに不整合がある場合はデバイス一覧を取得し直す
    if (playbackState.device.id !== currentActiveDeviceId) {
      dispatch('getDeviceList')
        .then(() => {
          this.$toast.pushPrimary('デバイスの変更を検知しました。');
        });
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
      const defaultTimeout = this.$getters()['playback/deviceState'] === 'self'
        ? 30 * 1000
        : 10 * 1000;
      const remainingTimeMs = this.$getters()['playback/remainingTimeMs'];
      const hasTrack = this.$getters()['playback/hasTrack'];
      const isPlaying = this.$getters()['playback/isPlaying'];
      // TODO: 設定で間隔設定できるようにしたい
      // timeout が指定されない場合は、このデバイスで再生中の場合は30秒、そうでなければ10秒
      const nextTimeout = timeout ?? defaultTimeout;
      // トラックがセットされていて再生中の場合、曲を再生しきって 500ms の方が先に来ればそれを採用
      const timer = setTimeout(callback, hasTrack && isPlaying
        ? Math.min(remainingTimeMs + 500, nextTimeout)
        : nextTimeout);
      commit('SET_POLLING_PLAYBACK_TIMER', timer);
    };

    const handler = async () => {
      if (document.visibilityState === 'hidden') {
        // タイマーはセットせず、visibilityState が visible になったときに再度実行
        document.addEventListener('visibilitychange', handler);
        return;
      }
      document.removeEventListener('visibilitychange', handler);

      // getCurrentPlayback する前に再生中のアイテムの情報を保持していていたか
      const previousHasTrack = this.$getters()['playback/hasTrack'];
      const playbackState = await dispatch('getCurrentPlayback');
      // 何らかのエラー (i.e.トークンの期限切れなど) が発生し、再生状況が取得できなかった場合は普通にタイマーを設定
      if (playbackState == null) return;

      // TODO: 無限にリトライしちゃう
      // 再生中のアイテムの情報を保持していて、エピソード以外でアイテムが取得できなかった場合はリトライ
      const shouldRetry = previousHasTrack
        && playbackState
        && playbackState.item == null
        && playbackState.currently_playing_type !== 'episode';
      setTimer(handler, shouldRetry ? 2000 : undefined);
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
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    if (getters.isDisallowed('resuming') && payload == null) {
      // TODO: resuming が禁止されるのは再生中である場合に限らない (ネットワークエラーなど)
      // commit('SET_IS_PLAYING', true);
      this.$toast.pushError('トラックを再生できません');
      return;
    }

    const params = () => {
      const deviceId = getters.playbackDeviceId;
      if (payload == null) {
        // uri が指定されなかった場合は一時停止を解除
        return {
          positionMs: state.positionMs,
          deviceId,
        };
      }
      if (payload.track != null) {
        const uri = payload.track.linkedFrom?.uri
          ?? payload.track.linked_from?.uri
          ?? payload.track.uri;
        return {
          context: payload.context,
          offset: { uri },
          deviceId,
        };
      }
      return {
        context: payload.context,
        offset: payload.offset,
        deviceId,
      };
    };
    const request = () => this.$spotify.player.play(params())
      .then(() => {
        commit('SET_IS_PLAYING', true);
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });

    await request()
      .catch(async (err: AxiosError) => {
        if (err.response?.status === 404) {
          // スリープならデバイスをアクティブにして再度リクエスト
          await dispatch('transferPlayback', {
            deviceId: state.activeDeviceId ?? state.deviceId,
          });
          return request();
        }
        console.error({ err });
        this.$toast.pushError('エラーが発生し、トラックを再生できません。');
        dispatch('pollCurrentPlayback', 0);
        return undefined;
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、トラックを再生できません。');
        dispatch('pollCurrentPlayback', 0);
      });
  },

  async pause({ getters, commit, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }

    if (getters.isDisallowed('pausing')) {
      commit('SET_IS_PLAYING', false);
      return;
    }

    await this.$spotify.player.pause({ deviceId: getters.playbackDeviceId })
      .then(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生しました。');
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
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }

    if (getters.isDisallowed('seeking')) return;

    // Playback SDK からの通知が来ない場合が偶にあるので先に変更しておく
    commit('SET_POSITION_MS', positionMs);
    const positionMsOfCurrentState = state.positionMs;

    await this.$spotify.player.seek({
      positionMs,
      deviceId: getters.playbackDeviceId,
    })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生しました。');
        // 現在の position に戻す
        commit('SET_POSITION_MS', currentPositionMs ?? positionMsOfCurrentState);
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  async next({ getters, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }

    if (getters.isDisallowed('skipping_next')) return;

    await this.$spotify.player.next({ deviceId: getters.playbackDeviceId })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、次の曲を再生できません。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  async previous({ getters, dispatch }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }

    if (getters.isDisallowed('skipping_prev')) return;

    await this.$spotify.player.previous({ deviceId: getters.playbackDeviceId })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、前の曲を再生できません。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * シャッフルのモードを変更
   */
  async shuffle({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }

    if (getters.isDisallowed('toggling_shuffle')) return;

    const { isShuffled } = state;
    const nextIsShuffled = !isShuffled;

    await this.$spotify.player.shuffle({
      state: nextIsShuffled,
      deviceId: getters.playbackDeviceId,
    })
      .then(() => {
        commit('SET_IS_SHUFFLED', nextIsShuffled);
      }).catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、シャッフルのモードを変更できませんでした。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * リピートのモードを変更
   */
  async repeat({
    state,
    getters,
    commit,
    dispatch,
  }) {
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    // 初回読み込み時は undefined
    if (state.repeatMode == null
      || getters.isDisallowed('toggling_repeat_context')
      || getters.isDisallowed('toggling_repeat_track')) return;

    const [repeatMode, repeatState] = nextRepeatState(state.repeatMode);
    await this.$spotify.player.repeat({
      state: repeatState,
      deviceId: getters.playbackDeviceId,
    })
      .then(() => {
        if (getters.deviceState === 'another') {
          commit('SET_REPEAT_MODE', repeatMode);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、リピートのモードを変更できませんでした。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
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
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    const { volumePercent: currentVolumePercent } = state;
    if (currentVolumePercent === volumePercent) return;

    await this.$spotify.player.volume({
      volumePercent,
      deviceId: getters.playbackDeviceId,
    })
      .then(() => {
        commit('SET_VOLUME_PERCENT', { volumePercent });
        commit('SET_IS_MUTED', volumePercent === 0);
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、ボリュームが変更できませんでした。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
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
    const isAuthorized = await dispatch('auth/confirmAuthState', { checkPremium: true }, { root: true });
    if (!isAuthorized) {
      this.$toast.requirePremium();
      return;
    }
    const {
      isMuted,
      volumePercent: currentVolumePercent,
    } = state;
    const nextMuteState = !isMuted;
    if (currentVolumePercent === 0) {
      commit('SET_IS_MUTED', nextMuteState);
      return;
    }

    await this.$spotify.player.volume({
      volumePercent: nextMuteState
        ? 0
        : currentVolumePercent,
      deviceId: getters.playbackDeviceId,
    })
      .then(() => {
        commit('SET_IS_MUTED', nextMuteState);
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.pushError('エラーが発生し、ボリュームをミュートにできませんでした。');
      })
      .finally(() => {
        if (getters.deviceState === 'another') {
          dispatch('pollCurrentPlayback', DEFAULT_TIMEOUT);
        }
      });
  },

  /**
   * セットされているトラックの保存状態を確認する
   */
  async checkTrackSavedState({ state, commit }, trackId) {
    const id = trackId ?? state.track?.id;
    if (id != null) {
      const [isSavedTrack] = await this.$spotify.library.checkUserSavedTracks({
        trackIdList: [id],
      });
      commit('SET_IS_SAVED_TRACK', isSavedTrack);
    }
  },

  modifyTrackSavedState({ getters, commit }, { trackId, isSaved }) {
    if (getters.isTrackSet(trackId)) {
      commit('SET_IS_SAVED_TRACK', isSaved);
    }
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
    commit('SET_DISABLED_PLAYING_FROM_BEGINNING', false);
    commit('SET_IS_SHUFFLED', false);
    commit('SET_REPEAT_MODE', 0);
    commit('SET_DISALLOWS', {});
    commit('SET_IS_MUTED', false);
  },
};

export default actions;
