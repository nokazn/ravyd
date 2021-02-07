import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

import { upsertToken, refreshAccessToken } from '@/helper';
import { TOKEN_EXPIRE_IN } from '@/config/constants';
import { logger } from 'shared/logger';
import type { paths } from 'shared/types';

type Path = paths['/auth']['get']
type ResponseBody = Path['responses'][200]['content']['application/json']

const { INTERNAL_SERVER_ERROR } = httpStatusCodes;

export const auth = async (req: Request, res: Response<ResponseBody>) => {
  const { refreshToken } = req.session;
  if (refreshToken == null) {
    // TODO: token と auth_state をリセット
    return res.send({
      code: 'UNAUTHORIZED',
      message: 'Need to log in.',
      authenticated: false,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  const token = await refreshAccessToken(refreshToken);
  if (token == null) {
    const code = 'INTERNAL_SERVER_ERROR';
    const message = 'Failed to update token.';
    logger.error(code, message, {
      session: req.session,
      token,
    });
    return res.status(INTERNAL_SERVER_ERROR).send({
      code,
      message,
      authenticated: false,
      authState: null,
      accessToken: null,
      expireIn: 0,
    });
  }

  const authState = upsertToken(req, token, { refreshToken });
  return res.send({
    code: 'OK',
    message: 'Updated token successfully.',
    authenticated: true,
    authState,
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  });
};
