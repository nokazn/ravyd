import { Request, Response } from 'express';
import crypto from 'crypto';
import httpStatusCodes from 'http-status-codes';

import { refreshAccessToken, logger } from '@/helper';
import {
  BASE_ORIGIN,
  SPOTIFY_CLIENT_ID,
  TOKEN_EXPIRE_IN,
  CSRF_STATE_COOKIE_KEY,
  SPOTIFY_AUTHORIZE_BASE_URL,
} from '@/config/constants';
import { createUrl } from '~~/shared/utils/createUrl';
import { SpotifyAPI, ServerAPI } from '~~/types';

type ResponseBody = ServerAPI.Auth.Login

const { BAD_REQUEST } = httpStatusCodes;

export const login = async (req: Request, res: Response<ResponseBody>) => {
  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session?.token;
  // リフレッシュトークンが存在していた場合はそれを更新
  if (currentToken?.refresh_token != null) {
    const token = await refreshAccessToken(currentToken.refresh_token);
    if (token == null) {
      logger.error({
        session: req.session,
        currentToken,
        token,
      });

      return res.status(BAD_REQUEST).send({
        accessToken: undefined,
        expireIn: 0,
        message: 'トークンを更新できませんでした。',
      });
    }

    req.session.token = {
      ...currentToken,
      ...token,
    };

    return res.send({
      accessToken: token.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  }

  // 認可用のページの URL を返す
  const csrfState = crypto.randomBytes(100).toString('base64');
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'streaming',
    'user-modify-playback-state',
    'playlist-modify-public',
    'playlist-modify-private',
    'ugc-image-upload',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-playback-position',
    'user-read-currently-playing',
    'user-read-recently-played',
    'playlist-read-private',
    'user-follow-read',
    'user-follow-modify',
  ].join(' ');
  const url = createUrl(SPOTIFY_AUTHORIZE_BASE_URL, {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${BASE_ORIGIN}/login/callback`,
    state: csrfState,
    scope,
  });

  res.cookie(CSRF_STATE_COOKIE_KEY, csrfState, {
    // 5分間有効
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  return res.send({ url });
};
