import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { refreshAccessToken, logger } from '@/helper';
import { TOKEN_EXPIRE_IN } from '@/config/constants';
import type { SpotifyAPI, ServerAPI } from '~~/types';

type ResponseBody = ServerAPI.Auth.Token

const { BAD_REQUEST } = httpStatusCodes;

export const auth = async (
  req: Request,
  res: Response<ResponseBody>,
) => {
  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session.token;
  if (currentToken == null) {
    return res.send({
      accessToken: undefined,
      expireIn: 0,
    });
  }

  const { expires_in } = currentToken;
  // 期限切れでない場合はそのまま返す
  if (expires_in - Date.now() > TOKEN_EXPIRE_IN) {
    return res.send({
      accessToken: currentToken.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  }

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
};
