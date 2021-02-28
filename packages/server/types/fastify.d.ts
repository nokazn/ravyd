import type { SpotifyAPI } from 'shared/types';

declare module 'fastify' {
  interface Session extends Record<string, unknown> {
    refreshToken?: SpotifyAPI.Auth.InitialToken['refresh_token'];
    tokens?: Record<string, SpotifyAPI.Auth.Token>;
    state?: string;
  }
}
