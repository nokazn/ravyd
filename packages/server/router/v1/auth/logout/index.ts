import { promisify } from 'util';
import httpStatusCodes from 'http-status-codes';
import type { FastifyRequest, FastifyReply } from 'fastify';

import { logger } from 'shared/logger';
import type { paths, JSONResponseOf } from 'shared/types';

// TODO
type ResponseBody = JSONResponseOf<paths['/auth/logout']['post']> | {};

const { INTERNAL_SERVER_ERROR, NO_CONTENT } = httpStatusCodes;

export const logout = (req: FastifyRequest, rep: FastifyReply): Promise<ResponseBody> => {
  return promisify(req.destroySession)()
    .then(() => {
      rep.code(NO_CONTENT);
      return {};
    })
    .catch((err: Error) => {
      const code = 'INTERNAL_SERVER_ERROR';
      const message = 'Failed to log out.';
      logger.error(code, message, err);
      rep.code(INTERNAL_SERVER_ERROR);
      return {
        code,
        message,
      };
    });
};
