import type { Actions } from 'typed-vuex';

import type { PlayerState } from './state';
import type { PlayerGetters } from './getters';
import type { PlayerMutations } from './mutations';

export type PlayerActions = {
  initPlayer: () => void
  disconnectPlayer: () => void
};

export type RootActions = {
  'player/initPlayer': PlayerActions['initPlayer']
  'player/disconnectPlayer': PlayerActions['disconnectPlayer']
};

const actions: Actions<PlayerState, PlayerActions, PlayerGetters, PlayerMutations> = {
  initPlayer({
    commit,
    getters,
    dispatch,
    rootGetters,
  }) {
    if (!rootGetters['auth/isLoggedin'] || !rootGetters['auth/isPremium']) {
      window.onSpotifyWebPlaybackSDKReady = () => {};
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // player が登録されていないときのみ初期化
      if (getters.isPlayerConnected || window.Spotify == null) return;

      // volumePercent と isMuted は localStorage で永続化されてる
      const player = new Spotify.Player({
        name: this.$constant.APP_NAME,
        // 0 ~ 1 で指定
        volume: this.$state().playback.isMuted
          ? 0
          : this.$state().playback.volumePercent / 100,
        // 初期化時とアクセストークンの更新が必要になった時に呼ばれる
        getOAuthToken: async (callback) => {
          const token = await dispatch('auth/refreshAccessToken', undefined, { root: true });
          if (token?.accessToken != null) {
            callback(token.accessToken);
            return;
          }
          const currentAccessToken = this.$state().auth.accessToken;
          if (currentAccessToken != null) {
            callback(currentAccessToken);
          }
        },
      });

      // デバイスの接続が完了したとき
      player.addListener('ready', async ({ device_id }) => {
        commit('playback/SET_DEVICE_ID', device_id, { root: true });
        await dispatch('playback/getDeviceList', undefined, { root: true });
        const currentActiveDevice = this.$getters()['playback/activeDevice'];
        if (currentActiveDevice == null) {
          // アクティブなデバイスがない場合はこのデバイスで再生
          await dispatch('playback/transferPlayback', {
            deviceId: device_id,
            play: false,
          }, { root: true });
        }
        // このデバイスで再生中の場合は初回の更新は30秒後、ほかのデバイスで再生中の場合はすぐに取得
        const firstTimeout = this.$state().playback.activeDeviceId === device_id
          ? 30 * 1000
          : 0;
        dispatch('playback/pollCurrentPlayback', firstTimeout, { root: true });
        console.info('This device goes active. 🚀');
      });

      // デバイスがオフラインのとき
      player.addListener('not_ready', ({ device_id }) => {
        console.info('This device has gone offline. 😴', device_id);
      });

      // ブラウザが EME コンテンツをサポートしていないなどの理由で現在の環境をサポートしていないとき
      player.addListener('initialization_error', (err) => {
        console.error({ err });
        this.$toast.set({
          color: 'error',
          message: '現在の環境ではフル再生をサポートしていません。',
          timeout: 1000 * 30,
        });
      });

      // 認証エラーが発生した場合
      player.addListener('authentication_error', async (err) => {
        console.error({ err });
        await dispatch('auth/refreshAccessToken', undefined, { root: true });
        // TODO: 再接続
        await dispatch('player/disconnectPlayer', undefined, { root: true });
        await dispatch('player/initPlayer', undefined, { root: true });
      });

      // プレミアムアカウントのユーザーでない場合
      player.addListener('account_error', (err) => {
        console.error({ err });
      });

      // ネットワークのエラーなどで、トラックが再生できないとき
      player.addListener('playback_error', (err) => {
        console.error({ err });
        this.$commit('playback/SET_IS_PLAYING', false);
        this.$toast.set({
          color: 'error',
          message: 'トラックを再生できません',
        });
      });

      // 再生状態の変更を受信したとき
      player.addListener('player_state_changed', ((playerState) => {
        // TODO: playerState は Nullable
        if (playerState == null) return;

        // TODO
        console.info(playerState);
        const {
          trackId: currentTrackId,
          repeatMode: currentRepeatMode,
        } = this.$state().playback;
        const {
          context: { uri },
          track_window: { current_track: track },
        } = playerState;

        // track を変更する前に行う
        const trackId = track.id;
        // アイテムが取得でき、id 変わったときだけチェック
        if (trackId != null && trackId !== currentTrackId) {
          dispatch('playback/checkTrackSavedState', trackId, { root: true });
        }

        commit('playback/SET_IS_PLAYING', !playerState.paused, { root: true });
        // 表示のちらつきを防ぐためにトラック (duration_ms) をセットしてからセット
        commit('playback/SET_DURATION_MS', playerState.duration, { root: true });
        commit('playback/SET_POSITION_MS', playerState.position, { root: true });
        commit('playback/SET_IS_SHUFFLED', playerState.shuffle, { root: true });
        commit('playback/SET_CONTEXT_URI', uri ?? undefined, { root: true });
        commit('playback/SET_CURRENT_TRACK', track, { root: true });
        commit('playback/SET_NEXT_TRACK_LIST', playerState.track_window.next_tracks, { root: true });
        commit('playback/SET_PREVIOUS_TRACK_LIST', playerState.track_window.previous_tracks, { root: true });
        commit('playback/SET_DISALLOWS', playerState.disallows, { root: true });
        commit('playback/SET_IS_PLAYBACK_SLEEP', false, { root: true });

        // TODO
        // 表示がちらつくので、初回以外は player/repeat 内で commit する
        if (currentRepeatMode == null) {
          commit('playback/SET_REPEAT_MODE', playerState.repeat_mode, { root: true });
        }
        // playback-sdk から提供される uri が存在する場合は customContext をリセット
        dispatch('playback/resetCustomContext', uri, { root: true });
      }));

      const isConnected = await player.connect();
      if (isConnected) {
        commit('SET_PLAYBACK_PLAYER', player);
        console.info('Successfully connected with this device. 🎉');
      }
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  disconnectPlayer({ state, commit }) {
    const { playbackPlayer } = state;
    if (playbackPlayer != null) {
      playbackPlayer.disconnect();
      // タイマーはクリア
      commit('playback/SET_POLLING_PLAYBACK_TIMER', undefined, { root: true });
      commit('SET_PLAYBACK_PLAYER', undefined);
    }
  },
};

export default actions;
