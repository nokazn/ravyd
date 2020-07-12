import { Actions } from 'vuex';

import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { REPEAT_STATE_LIST, APP_NAME } from '~/variables';
import { SpotifyAPI } from '~~/types';

export type PlayerActions = {
  initPlayer: () => void
  disconnectPlayer: () => void
  transferPlayback: ({ deviceId, play }: {
    deviceId: string
    play?: boolean
    force?: boolean
  }) => Promise<void>
  reconnectDevice: () => Promise<void>
  getActiveDeviceList: () => Promise<void>
  setCustomContext: (params: {
    contextUri?: string
    trackUriList: string[]
  }) => void
  resetCustomContext: () => void
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
          position,
          duration,
          paused: isPaused,
          shuffle: isShuffled,
          repeat_mode: repeatMode,
          track_window: {
            current_track: currentTrack,
            next_tracks: nextTracks,
            previous_tracks: previousTracks,
          },
          disallows,
        } = playerState;
        const disallowKeys = Object.keys(disallows) as Array<keyof typeof disallows>;
        const disallowList = disallowKeys.filter((key) => disallows[key]);

        const lastTrackId = this.$state().player.trackId;
        const trackId = currentTrack.id;
        // trackId 変わったときだけチェック
        if (trackId != null && trackId !== lastTrackId) {
          dispatch('checkTrackSavedState', trackId);
        }

        commit('SET_IS_PLAYING', !isPaused);
        commit('SET_CONTEXT_URI', uri ?? undefined);
        commit('SET_POSITION_MS', position);
        commit('SET_DURATION_MS', duration);
        commit('SET_IS_SHUFFLED', isShuffled);
        commit('SET_CURRENT_TRACK', currentTrack);
        commit('SET_NEXT_TRACK_LIST', nextTracks);
        commit('SET_PREVIOUS_TRACK_LIST', previousTracks);
        commit('SET_DISALLOW_LIST', disallowList);

        // 表示がちらつくので、初回以外は player/repeat 内で commit する
        if (this.$state().player.repeatMode == null) {
          commit('SET_REPEAT_MODE', repeatMode);
        }
        // playback-sdk から提供される uri が存在する場合は customContext をリセット
        if (uri != null) {
          dispatch('resetCustomContext');
        }
      }));

      player.addListener('ready', async ({ device_id }) => {
        commit('SET_DEVICE_ID', device_id);

        // 再生中でない場合
        if (!this.$state().player.isPlaying) {
          // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
          await dispatch('pause', { isInitializing: true });
        }

        await dispatch('transferPlayback', {
          deviceId: device_id,
          play: false,
        });

        // volme は 0 から 1
        const [volume] = await Promise.all([
          player.getVolume().catch((err: Error) => {
            console.error({ err });
            return 1;
          }),
          dispatch('getActiveDeviceList'),
        ] as const);

        commit('SET_VOLUME_PERCENT', { volumePercent: volume * 100 });

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
    commit('SET_CURRENTLY_PLAYING', undefined);
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

  async transferPlayback({ state, commit, dispatch }, { deviceId, play, force }) {
    // force === true の場合は強制的にリクエスト
    if (!force && deviceId === state.activeDeviceId) return;

    // play が指定されなかった場合は、現在の状態を維持
    await this.$spotify.player.transferPlayback({
      deviceId,
      play: play != null
        ? play
        : state.isPlaying,
    }).then(() => {
      commit('SET_ACTIVE_DEVICE_ID', deviceId);

      const playingDevice = state.deviceList.find((device) => device.id === deviceId);
      if (playingDevice != null) {
        // 再生されているデバイスの isActive を true にする
        const activeDeviceList: SpotifyAPI.Device[] = state.deviceList.map((device) => ({
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
      this.$toast.show('error', 'デバイスを変更できませんでした。');
    });
  },

  async reconnectDevice({ state, commit, dispatch }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();
    commit('SET_DEVICE_LIST', devices ?? []);

    // アクティブなデバイスか、見つからなければこのアプリ
    const activeDevice = devices?.find((device) => device.is_active)
      ?? devices?.find((device) => device.id === state.activeDeviceId);
    const deviceId = activeDevice?.id;
    if (deviceId == null) {
      this.$toast.show('error', 'デバイスが見つかりませんでした。');
      return;
    }

    commit('SET_ACTIVE_DEVICE_ID', deviceId);

    await dispatch('transferPlayback', {
      deviceId,
      force: true,
    });
  },

  async getActiveDeviceList({ state, commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();
    const deviceList = devices ?? [];

    commit('SET_DEVICE_LIST', deviceList);

    const activeDevice = deviceList.find((device) => device.id === state.deviceId);
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

  async getRecentlyPlayed({ commit }) {
    const recentlyPlayed = await this.$spotify.player.getRecentlyPlayed({});

    commit('SET_RECENTLY_PLAYED', recentlyPlayed);
  },

  /**
   * contextUri が album/playlist の時のみに offset.uri が有効
   * offset.position は playlist を再生する場合のみ?
   */
  async play({ state, commit, dispatch }, payload?) {
    const deviceId = state.activeDeviceId;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;

    const isNotUriPassed = contextUri == null && trackUriList == null;
    const isRestartingTracks = (
      trackUriList != null
      && offset?.position != null
      && state.trackUri === trackUriList[offset.position]
    ) || state.trackUri === offset?.uri;

    const playHandler = () => this.$spotify.player.play(
      // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止を解除
      isNotUriPassed || isRestartingTracks
        ? {
          deviceId,
          positionMs: state.positionMs,
        }
        : {
          deviceId,
          contextUri,
          trackUriList,
          offset,
        },
    );

    await playHandler()
      .then(() => {
        commit('SET_IS_PLAYING', true);
      })
      .catch(async (err: Error) => {
        console.error({ err });
        // デバイスを探し、再度トライ
        await dispatch('reconnectDevice');
        console.log('reconnect ended');
      })
      .then(() => {
        console.log('play');
        playHandler();
      })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、再生できません。');
      });
  },

  async pause({ state, commit }, payload = { isInitializing: false }) {
    const deviceId = state.activeDeviceId;
    const { isInitializing } = payload;
    const params = isInitializing
      ? { isInitializing }
      : { deviceId };

    await this.$spotify.player.pause(params)
      .catch((err) => {
        console.error({ err });
        this.$toast.show('warning', 'エラーが発生しました。');
      })
      .finally(() => {
        // エラーが発生しても停止させる
        commit('SET_IS_PLAYING', false);
      });
  },

  async seek({ state, commit }, { positionMs, currentPositionMs }) {
    const {
      activeDeviceId: deviceId,
      positionMs: positionMsOfState,
    } = state;

    await this.$spotify.player.seek({
      deviceId,
      positionMs,
    }).catch((err: Error) => {
      console.error({ err });
      // 現在の position に戻す
      commit('SET_POSITION_MS', currentPositionMs ?? positionMsOfState);
      this.$toast.show('error', 'エラーが発生しました。');
    });
  },

  async next({ state }) {
    const deviceId = state.activeDeviceId;

    await this.$spotify.player.next({ deviceId })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、次の曲を再生できません。');
      });
  },

  async previous({ state }) {
    const deviceId = state.activeDeviceId;

    await this.$spotify.player.previous({ deviceId })
      .catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', 'エラーが発生し、前の曲を再生できません。');
      });
  },

  async shuffle({ state, commit }) {
    const {
      activeDeviceId: deviceId,
      isShuffled,
    } = state;
    const nextIsShuffled = !isShuffled;

    await this.$spotify.player.shuffle({
      deviceId,
      state: nextIsShuffled,
    }).then(() => {
      commit('SET_IS_SHUFFLED', nextIsShuffled);
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('warning', 'エラーが発生し、シャッフルの状態を変更できませんでした。');
    });
  },

  async repeat({ state, commit }) {
    // 初回読み込み時は undefined
    if (state.repeatMode == null) return;

    const deviceId = state.activeDeviceId;
    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;

    await this.$spotify.player.repeat({
      deviceId,
      state: REPEAT_STATE_LIST[nextRepeatMode],
    }).then(() => {
      commit('SET_REPEAT_MODE', nextRepeatMode);
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('warning', 'エラーが発生し、シャッフルの状態を変更できませんでした。');
    });
  },

  async volume({ state, commit }, { volumePercent }) {
    const {
      activeDeviceId: deviceId,
      volumePercent: currentVolumePercent,
    } = state;
    if (currentVolumePercent === volumePercent) return;

    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    }).then(() => {
      commit('SET_VOLUME_PERCENT', { volumePercent });
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('error', 'エラーが発生し、ボリュームが変更できませんでした。');
    });
  },

  async mute({ state, commit }) {
    const {
      isMuted,
      activeDeviceId: deviceId,
      volumePercent: currentVolumePercent,
    } = state;
    const nextMuteState = !isMuted;
    if (currentVolumePercent === 0) return;

    const volumePercent = nextMuteState ? 0 : currentVolumePercent;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    }).then(() => {
      commit('SET_IS_MUTED', nextMuteState);
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('error', 'エラーが発生し、ボリュームをミュートにできませんでした。');
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
