import { SpotifyAPI } from '~~/types';

declare module 'express-session' {
    interface SessionData {
        token: SpotifyAPI.Auth.Token;
    }
}
