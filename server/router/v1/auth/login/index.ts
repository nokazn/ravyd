import crypto from 'crypto';
import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../../helper/refreshAccessToken';
import { createUrl } from '../../../../../utils/createUrl';
import { TOKEN_EXPIRE_IN, CSRF_STATE_COOKIE_KEY, SPOTIFY_AUTHORIZE_BASE_URL } from '../../../../config/constants';
import { SpotifyAPI, ServerAPI } from '~~/types';

type ResponseBody = ServerAPI.Auth.Login

export const login = async (req: Request, res: Response<ResponseBody>) => {
  if (req.session == null) {
    console.error({ session: req.session });

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session?.token;
  // リフレッシュトークンが存在していた場合はそれを更新
  if (currentToken?.refresh_token != null) {
    const token = await refreshAccessToken(currentToken.refresh_token);
    if (token == null) {
      console.error({
        session: req.session,
        currentToken,
        token,
      });

      return res.status(400).send({
        accessToken: undefined,
        expireIn: 0,
        message: 'トークンを更新できませんでした。',
      });
    }

    req.session.token = {
      ...req.session.token,
      ...token,
    };

    return res.send({
      accessToken: token.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  }

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_BASE_URL = process.env.BASE_URL;
  if (CLIENT_ID == null || SPOTIFY_BASE_URL == null) {
    console.error('環境変数が設定されていません。', process.env);
    return res.status(500).send({
      message: 'エラーが発生しました。',
      accessToken: undefined,
      expireIn: 0,
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
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${SPOTIFY_BASE_URL}/login/callback`,
    state: csrfState,
    scope,
  });

  res.cookie(CSRF_STATE_COOKIE_KEY, csrfState, {
    // 30分間有効
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: true,
  });

  return res.send({ url });
};
