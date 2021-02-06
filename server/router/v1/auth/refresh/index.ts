import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { TOKEN_EXPIRE_IN } from '@/config/constants';
import { refreshAccessToken, logger } from '@/helper';
import type { SpotifyAPI, ServerAPI } from '~~/types';

type RequestBody = {
  accessToken: string;
}

type ResponseBody = ServerAPI.Auth.Token

const { BAD_REQUEST, CONFLICT } = httpStatusCodes;

export const refresh = async (
  req: Request<{}, {}, RequestBody>,
  res: Response<ResponseBody>,
) => {
  const tokenInReqBody = req.body.accessToken;
  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session.token;
  // リフレッシュトークンが存在しない場合
  if (currentToken?.refresh_token == null) {
    const message = 'リフレッシュトークンを取得できず、トークンを更新できませんでした。';
    logger.warn(message, {
      session: req.session,
      currentToken,
      tokenInReqBody,
    });

    return res.status(BAD_REQUEST).send({
      accessToken: undefined,
      expireIn: 0,
      message,
    });
  }

  // 現在のトークンが一致しない場合
  if (currentToken.access_token !== tokenInReqBody) {
    const message = '現在のトークンが一致しないため、トークンを更新できませんでした。';
    logger.warn(message, {
      session: req.session,
      currentToken,
      tokenInReqBody,
    });

    // conflict
    return res.status(CONFLICT).send({
      accessToken: req.body.accessToken,
      expireIn: 0,
      message,
    });
  }

  const token = await refreshAccessToken(currentToken.refresh_token);
  if (token == null) {
    logger.error('トークンの更新に失敗しました。', {
      session: req.session,
      currentToken,
      token,
    });

    return res.status(BAD_REQUEST).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンの更新に失敗しました。',
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
};
