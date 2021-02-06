import { v4 as uuid4, v5 as uuid5 } from 'uuid';

export const generateAccessTokenKey = (refreshToken: string) => {
  const key = uuid4();
  return uuid5(key, refreshToken);
};
