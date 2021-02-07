import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { logger } from 'shared/logger';
import type { paths } from 'shared/types';

type Path = paths['/auth/logout']['post'];
type ResponseBody = Path['responses'][204 | 500]['content']['application/json']

const { INTERNAL_SERVER_ERROR, NO_CONTENT } = httpStatusCodes;

export const logout = (req: Request, res: Response<ResponseBody>) => {
  return req.session.destroy((err: Error | undefined) => {
    if (err != null) {
      const code = 'INTERNAL_SERVER_ERROR';
      const message = 'Failed to log out.';
      logger.error(code, message, { err });
      return res.status(INTERNAL_SERVER_ERROR).send({
        code,
        message,
      });
    }

    return res.status(NO_CONTENT).send();
  });
};
