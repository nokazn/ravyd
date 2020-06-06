import { Request, Response } from 'express';

import redisClient from '../../../../../db/redis';
import { refreshAccessToken } from '../../../../auth/refreshAccessToken';
import { TOKEN_EXPIRE_IN } from '../../index';
import { SpotifyAPI } from '~~/types';

type RequestParams = {}

type ResponseBody = {
  accessToken: string
  expireIn: number
} | {
  message: string
}

export const refresh = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  if (req.session == null || req.sessionID == null) {
    return res.status(401).send({ message: 'トークンを更新できませんでした。' });
  }

  const tokenInRedis = await redisClient.get(req.sessionID);
  if (tokenInRedis == null) {
    return res.status(400).send({ message: 'トークンを更新できませんでした。' });
  }

  const currentToken: SpotifyAPI.Auth.TokenResponseData = JSON.parse(tokenInRedis);
  if (currentToken.refresh_token == null) {
    return res.status(400).send({ message: 'トークンを更新できませんでした。' });
  }

  const token = await refreshAccessToken(currentToken.refresh_token);
  if (token == null) {
    return res.status(500).send({ message: 'トークンを更新できませんでした。' });
  }

  const currentSessionId = req.sessionID;
  return req.session.regenerate(async (err) => {
    if (err != null) {
      console.error({ err });
      return;
    }

    await Promise.all([
      redisClient.del(currentSessionId),
      redisClient.set(req.sessionID!, JSON.stringify({
        ...currentToken,
        ...token,
      })),
    ]);

    res.send({
      accessToken: token.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  });
};
