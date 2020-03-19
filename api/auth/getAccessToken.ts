import axios from 'axios';
import { Spotify } from '@/types';

export const getAccessToken = (
  code: string,
): Promise<Spotify.Auth.TokenResponseData> | null => {
  const redirectUrl = process.env.BASE_URL;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (redirectUrl == null || clientId == null || clientSecret == null) return null;

  const baseUrl = 'https://accounts.spotify.com/api/token';
  const params: Spotify.Auth.TokenRequestBody = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUrl,
  };

  return axios({
    url: baseUrl,
    method: 'post',
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
    .catch((e) => console.error(e));
};
