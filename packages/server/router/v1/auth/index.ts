import httpStatusCodes from 'http-status-codes';
import type { FastifyRequest, FastifyReply } from 'fastify';

import { upsertToken, refreshAccessToken } from '@/helper';
import { TOKEN_EXPIRE_IN } from '@/config/constants';
import type { paths, JSONResponseOf } from 'shared/types';

type ResponseBody = JSONResponseOf<paths['/auth']['get']>

const { INTERNAL_SERVER_ERROR } = httpStatusCodes;

export const auth = async (req: FastifyRequest, rep: FastifyReply): Promise<ResponseBody> => {
  const { refreshToken } = req.session;
  if (refreshToken == null) {
    // TODO: token と auth_state をリセット
    return {
      code: 'UNAUTHORIZED',
      message: 'Need to log in.',
      authenticated: false,
      authState: null,
      accessToken: null,
      expireIn: 0,
    };
  }

  const token = await refreshAccessToken(refreshToken);
  if (token == null) {
    const code = 'INTERNAL_SERVER_ERROR';
    const message = 'Failed to update token.';
    req.log.error(code, message, {
      session: req.session,
      token,
    });
    rep.code(INTERNAL_SERVER_ERROR);
    return {
      code,
      message,
      authenticated: false,
      authState: null,
      accessToken: null,
      expireIn: 0,
    };
  }

  const authState = upsertToken(req, token, { refreshToken });
  return {
    code: 'OK',
    message: 'Updated token successfully.',
    authenticated: true,
    authState,
    accessToken: token.access_token,
    expireIn: TOKEN_EXPIRE_IN,
  };
};
