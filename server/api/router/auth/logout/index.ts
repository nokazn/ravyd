import { Request, Response } from 'express';
import redisClient from '../../../../../db/redis';

type RequestParams = {}

type ResponseBody = {}

export const logout = (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  if (req.session == null || req.sessionID == null) {
    return res.status(200);
  }

  return req.session.destroy(async (err: Error) => {
    if (err != null) {
      console.error({ err });
    }

    await redisClient.del(req.sessionID!);

    return res.status(200);
  });
};
