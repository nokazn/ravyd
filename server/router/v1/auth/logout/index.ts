import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { logger } from '@/helper';

const { BAD_REQUEST, NO_CONTENT } = httpStatusCodes;

export const logout = (req: Request, res: Response) => {
  return req.session.destroy((err: Error) => {
    if (err != null) {
      logger.error({ err });
      return res.status(BAD_REQUEST).send();
    }

    return res.status(NO_CONTENT).send();
  });
};
