import { Request, Response } from 'express';

import { getAccessToken } from '../../../../auth/getAccessToken';
import { TOKEN_EXPIRE_IN } from '../../index';
import { ServerAPI } from '~~/types';

type RequestParams = {
  code: string
}

type ResponseBody = ServerAPI.Auth.Token

export const callback = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  if (req.session == null) {
    console.error(JSON.stringify(req.session, undefined, 2));

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const { code }: { code: string | undefined} = req.body;

  if (code == null) {
    const { error }: { error?: string } = req.query;
    console.error(
      'code が取得できませんでした。',
      JSON.stringify({
        params: req.params,
        body: req.body,
        code,
      }, undefined, 2),
    );

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: error ?? '認証時にエラーが発生しました。',
    });
  }

  // code と token を交換する
  const token = await getAccessToken(code);
  if (token == null) {
    console.error(JSON.stringify({
      session: req.session,
      code,
      token,
    }, undefined, 2));

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: '認証時にエラーが発生しました。',
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
