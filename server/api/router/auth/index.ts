import { Request, Response } from 'express';

import redisClient from '../../../../db/redis';
import { TOKEN_EXPIRE_IN } from '../index';
import { SpotifyAPI } from '~~/types';

type RequestParams = {}

type ResponseBody = {
  accessToken: string
  expireIn: number
}

export const auth = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  const data = await redisClient.get(req.sessionID!);
  const token: SpotifyAPI.Auth.TokenResponseData = data != null
    ? JSON.parse(data)
    : {};

  return res.send({
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
