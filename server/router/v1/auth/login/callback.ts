import { Request, Response } from 'express';

import { getAccessToken } from '../../../../helper/getAccessToken';
import { TOKEN_EXPIRE_IN, CSRF_STATE_COOKIE_KEY } from '../../../../config/constants';
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
  const { code, state } = req.query;
  if (code == null) {
    console.error('code が取得できませんでした。', {
      params: req.params,
      body: req.body,
      code,
    });

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: '認証時にエラーが発生しました。',
    });
  }

  // 送られてきた state と、認可時に送信し、cookie に埋め込んだ csrfState を比較
  const { [CSRF_STATE_COOKIE_KEY]: csrfState } = req.cookies;
  if (state != null && state !== csrfState) {
    const message = 'state が一致しないため、アクセストークンを発行できません。';
    console.error(message, {
      params: req.params,
      body: req.body,
      code,
      state,
      csrfState,
    });

    return res.status(403).send({
      accessToken: undefined,
      expireIn: 0,
      message,
    });
  }

  // csrfState を削除
  res.clearCookie(CSRF_STATE_COOKIE_KEY);

  // code と token を交換する
  const token = await getAccessToken(code);
  if (token == null) {
    console.error({
      session: req.session,
      code,
      token,
    });

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: '認証時にエラーが発生しました。',
    });
  }

  const currentToken = req.session.token;
  req.session.token = {
    ...currentToken,
    ...token,
  };

  return res.send({
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
