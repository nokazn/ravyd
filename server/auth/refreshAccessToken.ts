import axios from 'axios';
import { SpotifyAPI } from '~~/types';

export const refreshAccessToken = (
  refresh_token: string | undefined,
): Promise<SpotifyAPI.Auth.Token | undefined> => {
  if (refresh_token == null) return Promise.resolve(undefined);

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  if (CLIENT_ID == null || CLIENT_SECRET == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify({
        CLIENT_ID,
        CLIENT_SECRET,
      }, undefined, 2),
    );
    return Promise.resolve(undefined);
  }

  const baseUrl = 'https://accounts.spotify.com/api/token';
  const params: SpotifyAPI.Auth.RefreshToken.Params = {
    grant_type: 'refresh_token',
    refresh_token,
  };

  return axios.post(baseUrl, undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
    params,
  })
    .then((res) => res.data)
    .catch((err: Error) => {
      console.error({ err });
      return undefined;
    });
};
