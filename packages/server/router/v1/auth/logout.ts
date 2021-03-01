import httpStatusCodes from 'http-status-codes';
import type { FastifyRequest, FastifyReply, FastifySchema } from 'fastify';

// import type { paths, JSONResponseOf } from 'shared/types';

// type ResponseBody = JSONResponseOf<paths['/auth/logout']['post']> | {};

const { INTERNAL_SERVER_ERROR, NO_CONTENT } = httpStatusCodes;

const handler = (req: FastifyRequest, rep: FastifyReply): void => {
  // TODO: Promisify する
  req.destroySession((err) => {
    if (err != null) {
      const code = 'INTERNAL_SERVER_ERROR';
      const message = 'Failed to log out.';
      return rep.code(INTERNAL_SERVER_ERROR).send({
        code,
        message,
      });
    }
    return rep.code(NO_CONTENT).send();
  });
};

const schema: FastifySchema = {};

export const logout = {
  handler,
  schema,
};
