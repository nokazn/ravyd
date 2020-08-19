import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../../auth/refreshAccessToken';
import { TOKEN_EXPIRE_IN } from '../../index';
import { SpotifyAPI, ServerAPI } from '~~/types';

type ResponseBody = ServerAPI.Auth.Token

export const refresh = async (req: Request, res: Response<ResponseBody>) => {
  if (req.session == null) {
    console.error(JSON.stringify(req.session, undefined, 2));

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session.token;
  if (currentToken?.refresh_token == null) {
    console.error(JSON.stringify({
      session: req.session,
      currentToken,
    }, undefined, 2));

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const token = await refreshAccessToken(currentToken.refresh_token);
  if (token == null) {
    console.error(JSON.stringify({
      session: req.session,
      currentToken,
      token,
    }, undefined, 2));

    return res.status(400).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  return req.session.regenerate((err) => {
    if (err != null) {
      return console.error({ err });
    }

    if (req.session == null) {
      console.error(JSON.stringify({
        session: req.session,
        currentToken,
        token,
      }, undefined, 2));

      return res.status(401).send({
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
  });
};
