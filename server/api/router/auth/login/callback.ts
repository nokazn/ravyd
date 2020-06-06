import { Request, Response } from 'express';

import { getAccessToken } from '../../../../auth/getAccessToken';
import redisClient from '../../../../../db/redis';
import { TOKEN_EXPIRE_IN } from '../../index';

type RequestParams = {
  code: string
}

type ResponseBody = {
  accessToken: string
  expireIn: number
} | {
  message: string
}

export const callback = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  const { code }: { code?: string } = req.body;

  if (typeof code !== 'string') {
    const { error }: { error?: string } = req.query;
    console.error(
      'code が取得できませんでした。',
      JSON.stringify({
        params: req.params,
        body: req.body,
        code,
      }, null, 2),
    );

    return res.status(400).send({ message: error ?? '認証時にエラーが発生しました。' });
  }

  // code と token を交換する
  const token = await getAccessToken(code);
  if (token == null) {
    return res.status(400).send({ message: '認証時にエラーが発生しました。' });
  }

  redisClient.set(req.sessionID!, JSON.stringify(token));

  return res.send({
    accessToken: token?.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
