import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { TOKEN_EXPIRE_IN } from '@/config/constants';
import { refreshAccessToken, upsertToken } from '@/helper';
import { logger } from 'shared/logger';
import type { paths, JSONResponseOf } from 'shared/types';

type Path = paths['/auth/refresh']['put'];
type RequestBody = Path['requestBody']['content']['application/json'];
type ResponseBody = JSONResponseOf<Path>;

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = httpStatusCodes;

export const refresh = async (
  req: Request<{}, ResponseBody, RequestBody>,
  res: Response<ResponseBody>,
) => {
  const { accessToken: accessTokenInReq, authState } = req.body;
  const { refreshToken } = req.session;
  // リフレッシュトークンが存在しない場合
  // TODO: 再度トークンリクエストできない？
  if (accessTokenInReq == null || authState == null || refreshToken == null) {
    const code = 'BAD_REQUEST';
    const message = 'Fail to update an token because of an incorrect accessToken or authState.';
    logger.warn(code, message, {
      session: req.session,
      body: req.body,
    });
    return res.status(BAD_REQUEST).send({
      code,
      message,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  const tokenInSession = req.session.tokens?.[authState];
  if (tokenInSession == null) {
    const code = 'UNAUTHORIZED';
    const message = 'Fail to update an token because of no corresponding session.';
    logger.error(code, message, {
      session: req.session,
      body: req.body,
    });
    return res.status(UNAUTHORIZED).send({
      code,
      message,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  // TODO:
  // 現在のトークンが一致しない場合は更新済のトークンを返す
  if (accessTokenInReq !== tokenInSession?.access_token) {
    const code = 'CONFLICT';
    const message = 'Fail to update an token because of conflicting.';
    logger.warn(code, message, {
      session: req.session,
      body: req.body,
    });
    return res.status(CONFLICT).send({
      code,
      message,
      authState,
      accessToken: tokenInSession?.access_token,
      expireIn: 0,
    });
  }

  const token = await refreshAccessToken(refreshToken);
  if (token == null) {
    const code = 'INTERNAL_SERVER_ERROR';
    const message = 'Fail to update an access token.';
    logger.error(code, message, {
      session: req.session,
      body: req.body,
      token,
    });
    return res.status(INTERNAL_SERVER_ERROR).send({
      code,
      message,
      authState,
      accessToken: null,
      expireIn: 0,
    });
  }

  upsertToken(req, token, { authState });

  return res.send({
    code: 'OK',
    message: 'Update an access token.',
    authState,
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
