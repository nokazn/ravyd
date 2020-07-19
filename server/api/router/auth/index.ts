import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../auth/refreshAccessToken';
import { TOKEN_EXPIRE_IN } from '../index';
import { SpotifyAPI } from '~~/types';

type RequestParams = {}

type ResponseBody = {
  message?: string
  accessToken: string | undefined
  expireIn: number
}

export const auth = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  if (req.session == null) {
    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const currentToken: SpotifyAPI.Auth.TokenResponseData | undefined = req.session?.token;
  if (currentToken == null) {
    return res.send({
      accessToken: undefined,
      expireIn: 0,
    });
  }

  const { expires_in } = currentToken;
  // 期限切れでない場合はそのまま返す
  if (Date.now() < expires_in) {
    return res.send({
      accessToken: currentToken.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  }

  const token = await refreshAccessToken(currentToken.refresh_token);
  if (token == null) {
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
};
