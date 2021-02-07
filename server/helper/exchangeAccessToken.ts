import axios from 'axios';

import {
  BASE_ORIGIN,
  SPOTIFY_TOKEN_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from '@/config/constants';
import { logger } from '@/helper/logger';
import type { SpotifyAPI } from '~~/types';

export const exchangeAccessToken = (
  code: string,
): Promise<SpotifyAPI.Auth.InitialToken | undefined> => {
  const params: SpotifyAPI.Auth.GetToken.Params = {
    grant_type: 'authorization_code',
    code,
    // validation のためのもので実際にレダイレクトされるわけではない
    redirect_uri: `${BASE_ORIGIN}/login/callback`,
  };

  return axios.post(SPOTIFY_TOKEN_BASE_URL, undefined, {
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
