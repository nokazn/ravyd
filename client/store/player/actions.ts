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
  }) => Promise<void>
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
  }) => void
  pause: (payload?: { isInitializing: boolean }) => void
  seek: (positionMs: number) => Promise<void>
  next: () => Promise<void>
  previous: () => Promise<void>
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
          const { accessToken }: { accessToken :string } = await this.$serverApi.$get('/api/auth')
            .catch((err) => {
              console.error({ err });
              return {};
            });
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
        commit('SET_POSITION', position);
        commit('SET_DURATION', duration);
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
        // デバイスをアクティブにする前に再生を止めないとアクティブにした後勝手に再生される可能性があるらしい
        await dispatch('pause', { isInitializing: true });
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

        commit('SET_VOLUME', { volumePercent: volume * 100 });

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
    commit('SET_ACTIVE_DEVICE_LIST', []);
    commit('SET_CURRENT_TRACK', undefined);
    commit('SET_NEXT_TRACK_LIST', []);
    commit('SET_PREVIOUS_TRACK_LIST', []);
    commit('SET_CURRENTLY_PLAYING', undefined);
    commit('SET_RECENTLY_PLAYED', undefined);
    commit('SET_IS_SAVED_TRACK', false);
    commit('SET_IS_PLAYING', false);
    commit('SET_CONTEXT_URI', undefined);
    commit('SET_POSITION', 0);
    commit('SET_DURATION', 0);
    commit('SET_IS_SHUFFLED', false);
    commit('SET_REPEAT_MODE', 0);
    commit('SET_DISALLOW_LIST', []);
    commit('SET_VOLUME', { volumePercent: 0 });
    commit('SET_IS_MUTED', false);
  },

  async transferPlayback({ state, commit, dispatch }, { deviceId, play }) {
    if (deviceId === state.deviceId) return;

    // play が指定されなかった場合は、現在の状態を維持
    await this.$spotify.player.transferPlayback({
      deviceId,
      play: play != null
        ? play
        : state.isPlaying,
    });

    commit('SET_DEVICE_ID', deviceId);

    const playingDevice = state.activeDeviceList.find((device) => device.id === deviceId);
    if (playingDevice != null) {
      // 再生されているデバイスの isActive を true にする
      const activeDeviceList: SpotifyAPI.Device[] = state.activeDeviceList.map((device) => ({
        ...device,
        is_active: device.id === deviceId,
      }));
      commit('SET_ACTIVE_DEVICE_LIST', activeDeviceList);
    } else {
      // デバイスのリストを取得しなおす
      await dispatch('getActiveDeviceList');
    }
  },

  async getActiveDeviceList({ state, commit }) {
    const { devices } = await this.$spotify.player.getActiveDeviceList();

    commit('SET_ACTIVE_DEVICE_LIST', devices ?? []);

    const playingDevice = state.activeDeviceList.find((device) => device.id === state.deviceId);
    if (playingDevice?.id != null) commit('SET_DEVICE_ID', playingDevice.id);
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
  play({ state, commit }, payload?) {
    const { deviceId } = state;
    const contextUri = payload?.contextUri;
    const trackUriList = payload?.trackUriList;
    const offset = payload?.offset;

    const isNotUriPassed = contextUri == null && trackUriList == null;
    const isRestartingTracks = (
      trackUriList != null
      && offset?.position != null
      && state.trackUri === trackUriList[offset.position]
    ) || state.trackUri === offset?.uri;

    this.$spotify.player.play(
      // uri が指定されなかったか、指定した uri がセットされているトラックと同じ場合は一時停止を解除
      isNotUriPassed || isRestartingTracks
        ? {
          deviceId,
          positionMs: state.position,
        }
        : {
          deviceId,
          contextUri,
          trackUriList,
          offset,
        },
    ).then(() => {
      commit('SET_IS_PLAYING', true);
    }).catch((err) => {
      console.error({ err });
    });
  },

  pause({ state, commit }, payload = { isInitializing: false }) {
    const { deviceId } = state;
    const { isInitializing } = payload;
    const params = isInitializing
      ? { isInitializing }
      : { deviceId };

    this.$spotify.player.pause(params)
      .then(() => {
        commit('SET_IS_PLAYING', false);
      })
      .catch((err) => {
        console.error({ err });
      });
  },

  async seek({ state }, positionMs) {
    const { deviceId } = state;
    await this.$spotify.player.seek({
      deviceId,
      positionMs,
    });
  },

  async next({ state }) {
    const { deviceId } = state;
    await this.$spotify.player.next({ deviceId });
  },

  async previous({ state }) {
    const { deviceId } = state;
    await this.$spotify.player.previous({ deviceId });
  },

  async shuffle({ state, commit }) {
    const { deviceId, isShuffled } = state;
    const nextIsShuffled = !isShuffled;
    await this.$spotify.player.shuffle({
      deviceId,
      state: nextIsShuffled,
    });

    commit('SET_IS_SHUFFLED', nextIsShuffled);
  },

  async repeat({ state, commit }) {
    // 初回読み込み時は undefined
    if (state.repeatMode == null) return;

    const { deviceId } = state;
    const nextRepeatMode = (state.repeatMode + 1) % REPEAT_STATE_LIST.length as 0 | 1 | 2;
    await this.$spotify.player.repeat({
      deviceId,
      state: REPEAT_STATE_LIST[nextRepeatMode],
    });

    commit('SET_REPEAT_MODE', nextRepeatMode);
  },

  async volume({ state, commit }, { volumePercent }) {
    const { deviceId } = state;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    });

    commit('SET_VOLUME', { volumePercent });
  },

  async mute({ state, commit }) {
    const { isMuted, deviceId, volume } = state;
    const nextMuteState = !isMuted;
    const volumePercent = nextMuteState ? 0 : volume;
    await this.$spotify.player.volume({
      deviceId,
      volumePercent,
    });

    commit('SET_IS_MUTED', nextMuteState);
  },

  async checkTrackSavedState({ state, commit }, trackId?) {
    const id = trackId ?? state.trackId;
    if (id == null) return;
    const trackIdList = [id];

    const [isSavedTrack] = await this.$spotify.library.checkUserSavedTracks({
      trackIdList,
    });

    commit('SET_IS_SAVED_TRACK', isSavedTrack);
  },

  modifyTrackSavedState({ state, commit }, { trackId, isSaved }) {
    if (state.trackId == null || state.trackId !== trackId) return;

    commit('SET_IS_SAVED_TRACK', isSaved);
  },
};

export default actions;
