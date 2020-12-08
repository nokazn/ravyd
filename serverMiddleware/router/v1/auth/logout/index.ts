import { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
  if (req.session == null) {
    return res.status(204).send();
  }

  return req.session.destroy((err: Error) => {
    if (err != null) {
      console.error({ err });
      return res.status(400).send();
    }

    return res.status(204).send();
  });
};
