import axios from 'axios';

import { SpotifyAPI } from '../../shared/types';
import { SPOTIFY_TOKEN_BASE_URL } from '../config/constants';

export const getAccessToken = (
  code: string,
): Promise<SpotifyAPI.Auth.Token> | undefined => {
  const REDIRECT_URL = process.env.CLIENT_ORIGIN;
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  if (REDIRECT_URL == null || CLIENT_ID == null || CLIENT_SECRET == null) {
    console.error('環境変数が設定されていません。', {
      REDIRECT_URL,
      CLIENT_ID,
      CLIENT_SECRET,
    });
    return undefined;
  }

  const params: SpotifyAPI.Auth.GetToken.Params = {
    grant_type: 'authorization_code',
    code,
    // validation のためのもので実際にレダイレクトされるわけではない
    redirect_uri: `${REDIRECT_URL}/login/callback`,
  };

  return axios.post(SPOTIFY_TOKEN_BASE_URL, undefined, {
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
