import axios from 'axios';
import urljoin from 'url-join';

import {
  CLIENT_ORIGIN,
  SPOTIFY_AUTHORIZE_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from '@/config/constants';
import { logger } from 'shared/logger';
import type { SpotifyAPI } from 'shared/types';

export const exchangeAccessToken = (
  code: string,
): Promise<SpotifyAPI.Auth.InitialToken | undefined> => {
  const params: SpotifyAPI.Auth.GetToken.Params = {
    grant_type: 'authorization_code',
    code,
    // validation のためのもので実際にレダイレクトされるわけではない
    redirect_uri: urljoin(CLIENT_ORIGIN, '/login/callback'),
  };

  // TODO: クライアントはまとめる
  return axios.post(urljoin(SPOTIFY_AUTHORIZE_BASE_URL, '/api/token'), undefined, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: SPOTIFY_CLIENT_ID,
      password: SPOTIFY_CLIENT_SECRET,
    },
    params,
  })
    .then((res) => res.data)
    .catch((err: Error) => {
      logger.error({ err });
      return undefined;
    });
};
