import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../helper/refreshAccessToken';
import { TOKEN_EXPIRE_IN } from '../../../config/constants';
import { SpotifyAPI, ServerAPI } from '~~/types';

type ResponseBody = ServerAPI.Auth.Token

export const auth = async (
  req: Request,
  res: Response<ResponseBody>,
) => {
  if (req.session == null) {
    console.error({ session: req.session });

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

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
    console.error({
      session: req.session,
      currentToken,
      token,
    });

    return res.status(400).send({
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
