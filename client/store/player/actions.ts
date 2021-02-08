import type { AxiosError } from 'axios';
import { Actions } from 'typed-vuex';

import type { ServerAPI } from 'shared/types';
import { PlayerState } from './state';
import { PlayerGetters } from './getters';
import { PlayerMutations } from './mutations';
import { APP_NAME } from '~/constants';

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

    const checkAccessToken = async (): Promise<string | undefined> => {
      const { accessToken, expireIn } = await this.$server.auth.root();
      commit('auth/SET_ACCESS_TOKEN', accessToken, { root: true });
      commit('auth/SET_EXPIRATION_MS', expireIn, { root: true });
      return accessToken ?? undefined;
    };

    const refreshAccessToken = async (
      currentAccessToken: string,
      currentAuthState: string,
      currentExpirationMs: number | undefined,
    ): Promise<string | undefined> => {
      // トークン更新中であれば待機して、期限切れのときのみ更新
      await this.$getters()['auth/finishedRefreshingToken']();
      if (!this.$getters()['auth/isTokenExpired']()) {
        return this.$state().auth.accessToken;
      }

      // 先に expireIn を設定しておき、他の action で refreshAccessToken されないようにする
      commit('auth/SET_EXPIRATION_MS', undefined, { root: true });
      commit('auth/SET_IS_REFRESHING', true, { root: true });

      return this.$server.auth.refresh({
        accessToken: currentAccessToken,
        authState: currentAuthState,
      })
        .then((token) => {
          commit('auth/SET_ACCESS_TOKEN', token.accessToken, { root: true });
          commit('auth/SET_EXPIRATION_MS', token.expireIn, { root: true });
          return token.accessToken ?? undefined;
        })
        .catch(async (err: AxiosError<ServerAPI.Auth.Token>) => {
          console.error({ err });
          if (err.response?.data == null) {
            commit('auth/SET_ACCESS_TOKEN', undefined, { root: true });
            commit('auth/SET_IS_REFRESHING', false, { root: true });
            return undefined;
          }
          if (err.response?.status === 409) {
            // コンフリクトして現在のトークンが一致しない場合 (409) は再取得
            await dispatch('auth/getAccessToken', undefined, { root: true });
            // 一度リセットした expirationMs を元に戻す
            commit('auth/SET_EXPIRATION_MS', currentExpirationMs, { root: true });
            return this.$state().auth.accessToken;
          }
          return err.response.data.accessToken;
        })
        .finally(() => {
          commit('auth/SET_IS_REFRESHING', false, { root: true });
        });
    };

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // player が登録されていないときのみ初期化
      if (getters.isPlayerConnected || window.Spotify == null) return;

      // volumePercent と isMuted は localStorage で永続化されてる
      const volume = this.$state().playback.isMuted
        ? 0
        : this.$state().playback.volumePercent / 100;
      const player = new Spotify.Player({
        name: APP_NAME,
        // 0 ~ 1 で指定
        volume,
        // アクセストークンの更新が必要になったら呼ばれる
        getOAuthToken: async (callback) => {
          const {
            accessToken: currentAccessToken,
            authState: currentAuthState,
            expirationMs,
          } = this.$state().auth;
          const isExpired = this.$getters()['auth/isTokenExpired']();
          // すでに保持しているアクセストークンが有効の場合はそれを使う
          if (currentAccessToken != null && !isExpired) {
            callback(currentAccessToken);
            return;
          }

          const accessToken = currentAccessToken == null || currentAuthState == null
            ? await checkAccessToken()
            : await refreshAccessToken(currentAccessToken, currentAuthState, expirationMs);

          if (accessToken == null) {
            await dispatch('auth/logout', undefined, { root: true });
            this.$router.push('/login');
            this.$toast.pushError('トークンを取得できなかったためログアウトしました。');
            return;
          }

          callback(accessToken);
        },
      });

      // デバイスの接続が完了したとき
      player.addListener('ready', async ({ device_id }) => {
        commit('playback/SET_DEVICE_ID', device_id, { root: true });
        // プレミアムアカウントのときのみ
        if (!this.$getters()['auth/isPremium']) return;

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
        console.info('Ready with this device 🚀');
      });

      // デバイスがオフラインのとき
      player.addListener('not_ready', ({ device_id }) => {
        console.info('This device has gone offline 😴', device_id);
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
        console.info('Successfully connected this device 🎉');
      }
    };

    window.onSpotifyWebPlaybackSDKReady();
  },

  disconnectPlayer({ state, commit }) {
    const { playbackPlayer } = state;
    if (playbackPlayer == null) return;

    playbackPlayer.disconnect();

    // タイマーはクリア
    commit('playback/SET_POLLING_PLAYBACK_TIMER', undefined, { root: true });
    commit('SET_PLAYBACK_PLAYER', undefined);
  },
};

export default actions;
