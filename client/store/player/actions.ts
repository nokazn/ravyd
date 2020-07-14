import { Actions } from 'vuex';

import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { REPEAT_STATE_LIST, APP_NAME } from '~/variables';
import { SpotifyAPI } from '~~/types';

export type PlayerActions = {
  initPlayer: () => void
  disconnectPlayer: () => void
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
  next: () => void
  previous: () => void
  shuffle: () => Promise<void>
  repeat: () => Promise<void>
  volume: ({ volumePercent }: { volumePercent: number }) => Promise<void>
  mute: () => Promise<void>
  checkTrackSavedState: (trackIds?: string) => Promise<void>
  modifyTrackSavedState: ({ trackId, isSaved }: {
    trackId?: string
    isSaved: boolean
  }) => void
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/disconnectPlayer': PlayerActions['disconnectPlayer']
  'player/transferPlayback': PlayerActions['transferPlayback']
  'player/getActiveDeviceList': PlayerActions['getActiveDeviceList']
  'player/setCustomContext': PlayerActions['setCustomContext']
  'player/resetCustomContext': PlayerActions['resetCustomContext']
  'player/getCurrentPlayback': PlayerActions['getCurrentPlayback']
  'player/getRecentlyPlayed': PlayerActions['getRecentlyPlayed']
  'player/play': PlayerActions['play']
  'player/pause': PlayerActions['pause']
  'player/seek': PlayerActions['seek']
  'player/next': PlayerActions['next']
  'player/previous': PlayerActions['previous']
  'player/shuffle': PlayerActions['shuffle']
  'player/repeat': PlayerActions['repeat']
  'player/volume': PlayerActions['volume']
  'player/mute': PlayerActions['mute']
  'player/checkTrackSavedState': PlayerActions['checkTrackSavedState']
  'player/modifyTrackSavedState': PlayerActions['modifyTrackSavedState']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({
    commit,
    getters,
    dispatch,
    rootGetters,
  }) {
    const isLoggedin = rootGetters['auth/isLoggedin'];
    if (!isLoggedin) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // player が登録されていないときのみ初期化
      if (getters.isPlayerConnected || window.Spotify == null) return;

      const player = new Spotify.Player({
        name: APP_NAME,
        // アクセストークンの更新が必要になったら呼ばれる
        getOAuthToken: async (callback) => {
          const { accessToken, expireIn }: {
            accessToken?: string
            expireIn: number
          } = await this.$serverApi.$post('/api/auth/refresh')
            .catch((err) => {
              console.error({ err });
              return {};
            });

          commit('auth/SET_TOKEN', accessToken, { root: true });
          commit('auth/SET_EXPIRE_MILLIS', expireIn, { root: true });

          const currentTimerId = this.$state().auth.refreshTokenTimerId;
          if (currentTimerId != null) {
            clearTimeout(currentTimerId);
          }

          if (accessToken == null) {
            dispatch('auth/logout', undefined, { root: true });
            return;
          }

          // 50 分後にまだトークンが更新されてなかった場合更新
          const time = 1000 * 60 * 50;
          const refreshTokenTimer = setTimeout(() => {
            // time 経過後の状態を取得するため、引数の getters ではなく context から呼び出している
            if (this.$getters()['auth/isTokenExpired']) {
              dispatch('auth/refreshAccessToken', undefined, { root: true });
            }
          }, time);
          commit('auth/SET_REFRESH_TOKEN_TIMER_ID', refreshTokenTimer, { root: true });

          callback(accessToken);
        },
      });

      // エラーが発生した場合
      const errorList: Spotify.ErrorTypes[] = [
        'initialization_error',
        'account_error',
        'playback_error',
      ];
      errorList.forEach((errorType) => {
        player.addListener(errorType, (err) => {
          console.error({ errorType, err });
        });
      });

      // 認証エラーが発生した場合
      player.addListener('authentication_error', async (err) => {
        console.error({ err });
        await dispatch('auth/refreshAccessToken', undefined, { root: true });
      });

      player.addListener('player_state_changed', ((playerState) => {
        // playerState は Nullable
        if (playerState == null) return;

        // @todo
        console.log(playerState);
        const {
          context: { uri },
          track_window: {
            current_track: currentTrack,
          },
          disallows,
        } = playerState;
        const disallowKeys = Object.keys(disallows) as Array<keyof typeof disallows>;
        const disallowList = disallowKeys.filter((key) => disallows[key]);

        // currentTrack を変更する前に行う
        const lastTrackId = this.$state().player.trackId;
        const trackId = currentTrack.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) {
          dispatch('checkTrackSavedState', trackId);
        }

        commit('SET_IS_PLAYING', !playerState.paused);
        commit('SET_POSITION_MS', playerState.position);
        commit('SET_DURATION_MS', playerState.duration);
        commit('SET_IS_SHUFFLED', playerState.shuffle);
        commit('SET_CONTEXT_URI', uri ?? undefined);
        commit('SET_CURRENT_TRACK', currentTrack);
        commit('SET_NEXT_TRACK_LIST', playerState.track_window.next_tracks);
        commit('SET_PREVIOUS_TRACK_LIST', playerState.track_window.previous_tracks);
        commit('SET_DISALLOW_LIST', disallowList);

        // 表示がちらつくので、初回以外は player/repeat 内で commit する
        if (this.$state().player.repeatMode == null) {
          commit('SET_REPEAT_MODE', playerState.repeat_mode);
        }
        // playback-sdk から提供される uri が存在する場合は customContext をリセット
        if (uri != null) {
          dispatch('resetCustomContext');
        }
      }));

      player.addListener('ready', async ({ device_id }) => {
        commit('SET_DEVICE_ID', device_id);

        await dispatch('getActiveDeviceList');

        const activeDevice = this.$getters()['player/activeDevice'];
        if (activeDevice == null) {
          // アクティブなデバイスがない場合はこのデバイスで再生
          await dispatch('transferPlayback', {
            deviceId: device_id,
            play: false,
          });
        }

        await dispatch('getCurrentPlayback');

        console.log('Ready with this device 🎉');
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('This device has gone offline 😴', device_id);
      });

      await player.connect();

      commit('SET_PLAYBACK_PLAYER', player);
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  disconnectPlayer({ state, commit }) {
    const { playbackPlayer } = state;
    if (playbackPlayer == null) return;

    playbackPlayer.disconnect();

    commit('SET_PLAYBACK_PLAYER', undefined);
    commit('SET_DEVICE_ID', undefined);
    commit('SET_ACTIVE_DEVICE_ID', undefined);
    commit('SET_DEVICE_LIST', []);
    commit('SET_CURRENT_TRACK', undefined);
    commit('SET_NEXT_TRACK_LIST', []);
    commit('SET_PREVIOUS_TRACK_LIST', []);
    commit('SET_RECENTLY_PLAYED', undefined);
    commit('SET_IS_SAVED_TRACK', false);
    commit('SET_IS_PLAYING', false);
    commit('SET_CONTEXT_URI', undefined);
    commit('SET_POSITION_MS', 0);
    commit('SET_DURATION_MS', 0);
    commit('SET_IS_SHUFFLED', false);
    commit('SET_REPEAT_MODE', 0);
    commit('SET_DISALLOW_LIST', []);
    commit('SET_VOLUME_PERCENT', { volumePercent: 0 });
    commit('SET_IS_MUTED', false);
  },

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
      dispatch('disconnectPlayer');
      dispatch('initPlayer');
    });
  },

  async getActiveDeviceList({ commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();
    const deviceList = devices ?? [];

    commit('SET_DEVICE_LIST', deviceList);

    const activeDevice = deviceList.find((device) => device.is_active);

    commit('SET_VOLUME_PERCENT', {
      volumePercent: activeDevice != null
        ? activeDevice.volume_percent
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
    const handler = async () => {
      const setTimer = () => {
        // このデバイスで再生中の場合は30秒、そうでなければ15秒
        const regurarPeriod = this.$getters()['player/isThisAppPlaying']
          ? 30 * 1000
          : 15 * 1000;
        const interval = this.$state().player.durationMs > 0
          // 曲を再生しきって 500ms の方が先に来ればそれを採用
          ? Math.min(this.$getters()['player/remainingTimeMs'] + 500, regurarPeriod)
          // 曲の長さが 0:00 の場合は一定時間経過後に再取得
          : regurarPeriod;
        const timer = setTimeout(handler, interval);

        commit('SET_GET_CURRENT_PLAYBACK_TIMER_ID', timer);
      };

      const setDisallowList = (disallows: SpotifyAPI.Disallows) => {
        const disallowKeys = Object.keys(disallows) as Array<keyof typeof disallows>;
        const disallowList = disallowKeys.filter((key) => disallows[key]);

        commit('SET_DISALLOW_LIST', disallowList);
      };

      const setTrack = (item: SpotifyAPI.Track | SpotifyAPI.Episode | null) => {
        // @todo episode 再生中だと null になる
        const track: Spotify.Track | undefined = item != null && item.type === 'track'
          ? {
            uri: item.uri,
            id: item.id,
            type: item.type,
            media_type: 'audio',
            name: item.name,
            is_playable: item.is_playable,
            album: item.album,
            artists: item.artists,
          }
          : undefined;
        /**
         * @todo
         * このリクエストではエピソードを再生中でもコンテンツの内容は取得できない
         * web Playback SDK では取得できるので、このデバイスで再生中の場合はそちらから取得できる
         */

        // @todo このデバイスで再生中でエピソードの内容が取得できなかった場合はパスする
        if (track == null && this.$getters()['player/isThisAppPlaying']) return;

        // currentTrack を変更する前に行う
        const lastTrackId = this.$state().player.trackId;
        const trackId = track?.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) {
          dispatch('checkTrackSavedState', trackId);
        }

        commit('SET_CURRENT_TRACK', track);
        commit('SET_DURATION_MS', item?.duration_ms ?? 0);
      };

      const market = this.$getters()['auth/userCountryCode'];
      const currentPlayback = await this.$spotify.player.getCurrentPlayback({ market });

      if (!currentPlayback) {
        // 再生状況が取得できない場合はこのデバイスで再生
        await dispatch('transferPlayback', {
          play: false,
          update: true,
        });
        this.$toast.show('primary', '再生していたデバイスが見つからないため、このデバイスをアクティブにします。');
        setTimer();
        return;
      }

      commit('SET_IS_PLAYING', currentPlayback.is_playing);
      commit('SET_CONTEXT_URI', currentPlayback.context?.uri);
      commit('SET_POSITION_MS', currentPlayback.progress_ms ?? 0);
      commit('SET_IS_SHUFFLED', currentPlayback.shuffle_state === 'on');
      commit('SET_NEXT_TRACK_LIST', []);
      commit('SET_PREVIOUS_TRACK_LIST', []);

      setDisallowList(currentPlayback.actions.disallows);
      setTrack(currentPlayback.item);

      // アクティブなデバイスのデータに不整合がある場合はデバイス一覧を取得し直す
      const activeDeviceId = currentPlayback.device.id;
      if (activeDeviceId !== this.$state().player.activeDeviceId) {
        dispatch('getActiveDeviceList')
          .then(() => {
            if (activeDeviceId !== this.$state().player.deviceId) {
              this.$toast.show('primary', 'デバイスの変更を検知しました。');
            }
          });
      }

      setTimer();
    };

    // 曲を再生しきって 500ms と timeout ms で早いほう
    const interval = Math.min(getters.remainingTimeMs + 500, timeout ?? 0);
    const timer = setTimeout(handler, interval);
    commit('SET_GET_CURRENT_PLAYBACK_TIMER_ID', timer);
  },

  async getRecentlyPlayed({ commit }) {
    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed();

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * offset.position は playlist を再生する場合のみ?
   */
  async play({ state, commit, dispatch }, payload?) {
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

        dispatch('getCurrentPlayback', 500);
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、再生できません。');

        dispatch('getCurrentPlayback');
      });
  },

  async pause({ getters, commit, dispatch }, payload = { isInitializing: false }) {
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

  async seek({ state, commit, dispatch }, { positionMs, currentPositionMs }) {
    const positionMsOfCurrentState = state.positionMs;

    await this.$spotify.player.seek({ positionMs })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生しました。');

        // 現在の position に戻す
        commit('SET_POSITION_MS', currentPositionMs ?? positionMsOfCurrentState);
      })
      .finally(() => {
        dispatch('getCurrentPlayback', 1000);
      });
  },

  async next({ dispatch }) {
    await this.$spotify.player.next()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、次の曲を再生できません。');
      })
      .finally(() => {
        dispatch('getCurrentPlayback', 500);
      });
  },

  async previous({ dispatch }) {
    await this.$spotify.player.previous()
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、前の曲を再生できません。');
      })
      .finally(() => {
        dispatch('getCurrentPlayback', 500);
      });
  },

  async shuffle({ state, commit, dispatch }) {
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
        dispatch('getCurrentPlayback', 500);
      });
  },

  async repeat({ state, commit, dispatch }) {
    // 初回読み込み時は undefined
    if (state.repeatMode == null) return;

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
        dispatch('getCurrentPlayback', 500);
      });
  },

  async volume({ state, commit, dispatch }, { volumePercent }) {
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
        dispatch('getCurrentPlayback', 500);
      });
  },

  async mute({ state, commit, dispatch }) {
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
        dispatch('getCurrentPlayback', 500);
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
