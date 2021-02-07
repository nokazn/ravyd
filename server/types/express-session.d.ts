import { SpotifyAPI } from 'shared/types';

declare module 'express-session' {
    interface SessionData {
        /**
         * TODO: あとで削除する
         * @deprecated
         */
        token?: SpotifyAPI.Auth.Token;
        refreshToken?: SpotifyAPI.Auth.InitialToken['refresh_token'];
        tokens?: Record<string, SpotifyAPI.Auth.Token>;
    }
}
