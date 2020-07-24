import { Actions } from 'typed-vuex';

import { PlaybackState } from './state';
import { PlaybackGetters } from './getters';
import { PlaybackMutations } from './mutations';
import { REPEAT_STATE_LIST } from '~/variables';
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
  }) => void
  resetCustomContext: () => void
  getCurrentPlayback: (timeout?: number) => void
  getRecentlyPlayed: () => Promise<void>
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
  pause: (payload?: { isInitializing: boolean }) => Promise<void>
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
};

export type RootActions = {
  'playback/transferPlayback': PlaybackActions['transferPlayback']
  'playback/getActiveDeviceList': PlaybackActions['getActiveDeviceList']
  'playback/setCustomContext': PlaybackActions['setCustomContext']
  'playback/resetCustomContext': PlaybackActions['resetCustomContext']
  'playback/getCurrentPlayback': PlaybackActions['getCurrentPlayback']
  'playback/getRecentlyPlayed': PlaybackActions['getRecentlyPlayed']
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
};

const actions: Actions<PlaybackState, PlaybackActions, PlaybackGetters, PlaybackMutations> = {
  async transferPlayback({ state, commit, dispatch }, params) {
    // 指定されなければこのデバイス
    const deviceId = params?.deviceId ?? state.deviceId;
    if (deviceId == null) return;

    // play が指定されなかった場合は、デバイス内の状態を維持し、false が指定された場合は現在の状態を維持
    await this.$spotify.player.transferPlayback({
      deviceId,
      play: params?.play ?? state.isPlaying,
    }).then(() => {
      commit('SET_ACTIVE_DEVICE_ID', deviceId);

      // update が指定された場合は必ずデバイスのリストを取得し直す
      const update = params?.update;
      const { deviceList } = state;
      const activeDevice = deviceList.find((device) => device.id === deviceId);
      if (!update && activeDevice != null) {
        // 再生されているデバイスの isActive を true にする
        const activeDeviceList: SpotifyAPI.Device[] = deviceList.map((device) => ({
          ...device,
          is_active: device.id === deviceId,
        }));

        commit('SET_DEVICE_LIST', activeDeviceList);
      } else {
        // デバイスのリストを取得しなおす
        dispatch('getActiveDeviceList');
      }
    }).catch((err: Error) => {
      console.error({ err });
      dispatch('player/disconnectPlayer', undefined, { root: true });
      dispatch('player/initPlayer', undefined, { root: true });
    });
  },

  async getActiveDeviceList({ commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();
    const deviceList = devices ?? [];

    commit('SET_DEVICE_LIST', deviceList);

    const activeDevice = deviceList.find((device) => device.is_active);

    commit('SET_VOLUME_PERCENT', {
      volumePercent: activeDevice != null
        ? activeDevice.volume_percent as ZeroToHundred
        : 100,
    });

    if (activeDevice?.id != null) {
      commit('SET_ACTIVE_DEVICE_ID', activeDevice.id);
    }
  },

  setCustomContext({ commit }, { contextUri, trackUriList }) {
    if (contextUri != null) {
      commit('SET_CUSTOM_CONTEXT_URI', contextUri);
    }
    commit('SET_CUSTOM_TRACK_URI_LIST', trackUriList);
  },

  resetCustomContext({ commit }) {
    commit('SET_CUSTOM_CONTEXT_URI', undefined);
    commit('SET_CUSTOM_TRACK_URI_LIST', undefined);
  },

  getCurrentPlayback({ getters, commit, dispatch }, timeout) {
    const setTimer = (callback: () => Promise<void>, timout?: number) => {
      // このデバイスで再生中の場合は30秒、そうでなければ15秒
      const regurarPeriod = this.$getters()['playback/isThisAppPlaying']
        ? 30 * 1000
        : 15 * 1000;
      // トラックがセットされていて再生中の場合
      const interval = this.$state().playback.durationMs > 0 && this.$state().playback.isPlaying
        // 曲を再生しきって 500ms の方が先に来ればそれを採用
        ? Math.min(
          this.$getters()['playback/remainingTimeMs'] + 500,
          timout ?? regurarPeriod,
        )
        : timout ?? regurarPeriod;
      const timer = setTimeout(callback, interval);

      commit('SET_GET_CURRENT_PLAYBACK_TIMER_ID', timer);
    };

    const handler = async () => {
      const setTrack = (item: SpotifyAPI.Track | SpotifyAPI.Episode | null) => {
        // @todo episode 再生中だと null になる
        const track: Spotify.Track | undefined = item != null && item.type === 'track'
          ? {
            ...item,
            media_type: 'audio',
          }
          : undefined;
        /**
         * @todo
         * このリクエストではエピソードを再生中でもコンテンツの内容は取得できない
         * web Playback SDK では取得できるので、このデバイスで再生中の場合はそちらから取得できる
         */

        // @todo このデバイスで再生中でエピソードの内容が取得できなかった場合はパスする
        if (track == null && this.$getters()['playback/isThisAppPlaying']) return;

        // currentTrack を変更する前に行う
        const lastTrackId = this.$state().playback.trackId;
        const trackId = track?.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) {
          dispatch('checkTrackSavedState', trackId);
        }

        commit('SET_CURRENT_TRACK', track);
        commit('SET_DURATION_MS', item?.duration_ms);
      };

      const market = this.$getters()['auth/userCountryCode'];
      const currentPlayback = await this.$spotify.player.getCurrentPlayback({ market });

      // 再生中のアイテムの情報が存在し、現在の再生状況を取得できなかった場合
      const retryTimeout = (!currentPlayback || currentPlayback?.item == null)
        && this.$state().playback.trackId != null
        ? 1000
        : undefined;

      if (!currentPlayback) {
        const previousActiveDeviceId = this.$getters()['playback/activeDevice'];
        // 再生状況が取得できない場合はこのデバイスで再生
        await dispatch('transferPlayback', {
          play: false,
          update: true,
        });

        if (previousActiveDeviceId !== this.$getters()['playback/activeDevice']) {
          this.$toast.show('primary', '再生していたデバイスが見つからないため、このデバイスをアクティブにします。');
        }

        setTimer(handler, retryTimeout);
        return;
      }

      commit('SET_IS_PLAYING', currentPlayback.is_playing);
      commit('SET_CONTEXT_URI', currentPlayback.context?.uri);
      commit('SET_IS_SHUFFLED', currentPlayback.shuffle_state === 'on');
      commit('SET_DISALLOWS', currentPlayback.actions.disallows);
      setTrack(currentPlayback.item);
      // 表示のちらつきを防ぐためにトラック (duration_ms) をセットしてからセット
      commit('SET_POSITION_MS', currentPlayback.progress_ms ?? 0);

      // このデバイスで再生中の場合は Web Playback SDK から取得する
      if (!getters.isThisAppPlaying) {
        commit('SET_NEXT_TRACK_LIST', []);
        commit('SET_PREVIOUS_TRACK_LIST', []);
      }

      // アクティブなデバイスのデータに不整合がある場合はデバイス一覧を取得し直す
      const activeDeviceId = currentPlayback.device.id;
      if (activeDeviceId !== this.$state().playback.activeDeviceId) {
        dispatch('getActiveDeviceList')
          .then(() => {
            if (activeDeviceId !== this.$state().playback.deviceId) {
              this.$toast.show('primary', 'デバイスの変更を検知しました。');
            }
          });
      }

      setTimer(handler, retryTimeout);
    };

    setTimer(handler, timeout);
  },

  async getRecentlyPlayed({ commit }) {
    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed();

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * offset.position は playlist を再生する場合のみ?
   */
  async play({
    state, getters, commit, dispatch,
  }, payload?) {
    if (getters.isDisallowed('resuming') && payload == null) {
      commit('SET_IS_PLAYING', true);
      return;
    }

    const { positionMs } = state;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;

    const isNotUriPassed = contextUri == null && trackUriList == null;
    const isRestartingTracks = (trackUriList != null
      && offset?.position != null
      && state.trackUri === trackUriList[offset.position]
    ) || state.trackUri === offset?.uri;

    // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止を解除
    await this.$spotify.player.play(isNotUriPassed || isRestartingTracks
      ? { positionMs }
      : {
        contextUri,
        trackUriList,
        offset,
      })
      .then(() => {
        commit('SET_IS_PLAYING', true);

        if (!getters.isThisAppPlaying) {
          dispatch('getCurrentPlayback', 500);
        }
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、再生できません。');

        dispatch('getCurrentPlayback');
      });
  },

  async pause({ getters, commit, dispatch }, payload = { isInitializing: false }) {
    if (getters.isDisallowed('pausing')) {
      commit('SET_IS_PLAYING', false);
      return;
    }

    const { isInitializing } = payload;
    const params = isInitializing
      ? { isInitializing }
      : {};

    await this.$spotify.player.pause(params)
      .then(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('getCurrentPlayback', 500);
        }
      })
      .catch((err) => {
        console.error({ err });
        this.$toast.show('warning', 'エラーが発生しました。');

        dispatch('getCurrentPlayback');
      }).finally(() => {
        // エラーが発生しても停止させる
        commit('SET_IS_PLAYING', false);
      });
  },

  async seek({
    state, getters, commit, dispatch,
  }, { positionMs, currentPositionMs }) {
    if (getters.isDisallowed('seeking')) return;

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
          dispatch('getCurrentPlayback', 1000);
        }
      });
  },

  async next({ getters, dispatch }) {
    if (getters.isDisallowed('skipping_next')) return;

    await this.$spotify.player.next()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、次の曲を再生できません。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async previous({ getters, dispatch }) {
    if (getters.isDisallowed('skipping_prev')) return;

    await this.$spotify.player.previous()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、前の曲を再生できません。');
      })
      .finally(() => {
        if (!getters.isThisAppPlaying) {
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async shuffle({
    state, getters, commit, dispatch,
  }) {
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
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async repeat({
    state, getters, commit, dispatch,
  }) {
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
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async volume({
    state, getters, commit, dispatch,
  }, { volumePercent }) {
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
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async mute({
    state, getters, commit, dispatch,
  }) {
    const {
      isMuted,
      volumePercent: currentVolumePercent,
    } = state;
    const nextMuteState = !isMuted;
    if (currentVolumePercent === 0) return;

    const volumePercent = nextMuteState ? 0 : currentVolumePercent;
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
          dispatch('getCurrentPlayback', 500);
        }
      });
  },

  async checkTrackSavedState({ state, commit }, trackId?) {
    const id = trackId ?? state.trackId;
    if (id == null) return;

    const trackIdList = [id];
    const [isSavedTrack] = await this.$spotify.library.checkUserSavedTracks({ trackIdList });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },

  modifyTrackSavedState({ state, commit }, { trackId, isSaved }) {
    if (state.trackId == null || state.trackId !== trackId) return;

    commit('SET_IS_SAVED_TRACK', isSaved);
  },
};

export default actions;
