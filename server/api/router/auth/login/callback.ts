import { Request, Response } from 'express';

import { getAccessToken } from '../../../../auth/getAccessToken';
import { TOKEN_EXPIRE_IN } from '../../index';
import { ServerAPI } from '~~/types';

type RequestQuery = {
  code: string
  state: string
}

type ResponseBody = ServerAPI.Auth.Token

export const callback = async (
  req: Request<{}, {}, {}, RequestQuery>,
  res: Response<ResponseBody>,
) => {
  if (req.session == null) {
    console.error(JSON.stringify(req.session, undefined, 2));

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const { code, state } = req.query;
  if (code == null) {
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
      message: '認証時にエラーが発生しました。',
    });
  }

  // 送られてきた state と、認可時に送信し、cookie に埋め込んだ csrfState を比較
  const { csrfState } = req.cookies;
  if (state != null && state !== csrfState) {
    const message = 'state が一致しないため、アクセストークンを発行できません。';
    console.error(
      message,
      JSON.stringify({
        params: req.params,
        body: req.body,
        code,
        state,
        csrfState,
      }, undefined, 2),
    );

    return res.status(403).send({
      accessToken: undefined,
      expireIn: 0,
      message,
    });
  }

  // csrfState を削除
  res.clearCookie('csrfState');

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
