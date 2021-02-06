import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { generateAccessTokenKey, exchangeAccessToken, logger } from '@/helper';
import { TOKEN_EXPIRE_IN, CSRF_STATE_COOKIE_KEY } from '@/config/constants';
import type { paths } from '~~/shared/types';

type Path = paths['/auth/login/callback']['get']
type RequestQuery = Path['parameters']['query']
type ResponseBody = Path['responses'][200 | 400 | 403 |500]['content']['application/json']

const { BAD_REQUEST, UNAUTHORIZED } = httpStatusCodes;

export const callback = async (
  req: Request<{}, {}, {}, RequestQuery>,
  res: Response<ResponseBody>,
) => {
  const { code, state } = req.query;
  if (code == null) {
    const message = 'code in query parameters is invalid.';
    logger.error(message, {
      query: req.query,
      body: req.body,
      code,
    });
    return res.status(BAD_REQUEST).send({
      code: 'BAD REQUEST',
      message,
      accessTokenKey: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  // 送られてきた state と、認可時に送信し cookie に埋め込んだ state を比較
  const { [CSRF_STATE_COOKIE_KEY]: csrfState } = req.cookies;
  if (state == null || state !== csrfState) {
    const message = "CSRF state doesn't match.";
    logger.error(message, {
      query: req.query,
      body: req.body,
      state,
      csrfState,
    });
    return res.status(UNAUTHORIZED).send({
      code: 'UNAUTHORIZED',
      message,
      accessTokenKey: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  // code と token を交換する
  const token = await exchangeAccessToken(code);
  if (token == null) {
    logger.error({
      session: req.session,
      code,
      token,
    });
    return res.clearCookie(CSRF_STATE_COOKIE_KEY).status(BAD_REQUEST).send({
      code: 'INTERNAL SERVER ERROR',
      message: '認証時にエラーが発生しました。',
      accessTokenKey: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  const currentToken = req.session.token;
  req.session.token = {
    ...currentToken,
    ...token,
  };
  const currentTokens = req.session.tokens ?? [];
  const accessTokenKey = generateAccessTokenKey(token.refresh_token);
  req.session.tokens = [
    ...currentTokens,
    {
      key: accessTokenKey,
      value: token,
    },
  ];

  return res.clearCookie(CSRF_STATE_COOKIE_KEY).send({
    // TODO:
    code: '',
    message: '',
    accessTokenKey,
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
