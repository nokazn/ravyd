import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../../helper/refreshAccessToken';
import { TOKEN_EXPIRE_IN } from '../../../../config/constants';
import { SpotifyAPI, ServerAPI } from '~~/types';

type ReqestBody = {
  accessToken: string;
}

type ResponseBody = ServerAPI.Auth.Token

export const refresh = async (
  req: Request<{}, {}, ReqestBody>,
  res: Response<ResponseBody>,
) => {
  if (req.session == null) {
    console.error('セッションを取得できず、トークンを更新できませんでした。', {
      session: req.session,
    });

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const tokenInReqBody = req.body.accessToken;
  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session.token;
  // リフレッシュトークンが存在しないか、現在のトークンが一致しない場合はそのまま返す
  if (currentToken?.refresh_token == null || currentToken.access_token !== tokenInReqBody) {
    const message = currentToken?.refresh_token == null
      ? 'リフレッシュトークンを取得できず、トークンを更新できませんでした。'
      : '現在のトークンが一致しないため、トークンを更新できませんでした。';
    console.warn(message, {
      session: req.session,
      currentToken,
      tokenInReqBody,
    });

    return res.status(204).send({
      accessToken: req.body.accessToken,
      expireIn: 0,
      message,
    });
  }

  const token = await refreshAccessToken(currentToken.refresh_token);
  if (token == null) {
    console.error('トークンの更新に失敗しました。', {
      session: req.session,
      currentToken,
      token,
    });

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンの更新に失敗しました。',
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
