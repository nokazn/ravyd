import axios from 'axios';
import { SpotifyAPI } from '~~/types';

export const refreshAccessToken = (
  refresh_token: string,
): Promise<SpotifyAPI.Auth.TokenResponseData> | null => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (clientId == null || clientSecret == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify({
        clientId,
        clientSecret,
      }, null, 2),
    );
    return null;
  }

  const baseUrl = 'https://accounts.spotify.com/api/token';
  const params: SpotifyAPI.Auth.RefreshTokenRequestParams = {
    grant_type: 'refresh_token',
    refresh_token,
  };

  return axios.post(baseUrl, undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: clientId,
      password: clientSecret,
    },
    params,
  })
    .then((res) => res.data)
    .catch((err: Error) => {
      console.error({ err });
      return null;
    });
};
