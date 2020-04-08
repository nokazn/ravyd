import axios from 'axios';
import { Spotify } from '@/types';

export const refreshAccessToken = (
  refresh_token: string,
): Promise<Spotify.Auth.TokenResponseData> | null => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (clientId == null || clientSecret == null) return null;

  const baseUrl = 'https://accounts.spotify.com/api/token';
  const params: Spotify.Auth.RefreshTokenRequestParams = {
    grant_type: 'refresh_token',
    refresh_token,
  };

  return axios({
    url: baseUrl,
    method: 'POST',
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
    .catch((e) => {
      console.error(e);
      return null;
    });
};
