import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { upsertToken, exchangeAccessToken } from '@/helper';
import { TOKEN_EXPIRE_IN } from '@/config/constants';
import { logger } from 'shared/logger';
import type { paths, JSONResponseOf } from 'shared/types';

type Path = paths['/auth/login/callback']['get']
type RequestQuery = Path['parameters']['query']
type ResponseBody = JSONResponseOf<Path>

const { BAD_REQUEST, UNAUTHORIZED } = httpStatusCodes;

export const callback = async (
  req: Request<{}, {}, {}, RequestQuery>,
  res: Response<ResponseBody>,
) => {
  const { code: codeInQuery, state } = req.query;
  if (codeInQuery == null) {
    const code = 'BAD_REQUEST';
    const message = 'Code in query parameters is invalid.';
    logger.error(message, {
      query: req.query,
      codeInQuery,
    });
    return res.status(BAD_REQUEST).send({
      code,
      message,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  // 送られてきた state と、認可時に送信し cookie に埋め込んだ state を比較
  // TODO:
  if (state == null || state !== req.session.state) {
    const code = 'UNAUTHORIZED';
    const message = "CSRF state token doesn't match.";
    logger.error(code, message, {
      query: req.query,
      session: req.session,
      state,
    });
    return res.status(UNAUTHORIZED).send({
      code,
      message,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  // code と token を交換する
  const token = await exchangeAccessToken(codeInQuery);
  if (token == null) {
    const code = 'INTERNAL_SERVER_ERROR';
    const message = 'An error occurred when exchanging an access token with code.';
    logger.error(code, message, {
      session: req.session,
      code,
      token,
    });
    return res.status(BAD_REQUEST).send({
      code,
      message,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  const authState = upsertToken(req, token, { refreshToken: token.refresh_token });
  return res.send({
    code: 'OK',
    message: 'Logged in successfully.',
    authState,
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
