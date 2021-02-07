import { v4 as uuid4, v5 as uuid5 } from 'uuid';
import type { Request } from 'express';
import { SpotifyAPI } from '~~/types';

type Params = {
  authState: string;
  refreshToken?: undefined;
} | {
  authState?: undefined;
  refreshToken: string;
}

const generateAuthStateKey = (refreshToken: string) => {
  const key = uuid4();
  return uuid5(key, refreshToken);
};

export const upsertToken = (
  req: Request,
  token: SpotifyAPI.Auth.Token,
  params: Params,
): string => {
  const currentTokens = req.session.tokens ?? {};
  const authState = params.authState ?? generateAuthStateKey(params.refreshToken);
  if (params.refreshToken != null) {
    req.session.refreshToken = params.refreshToken;
  }
  req.session.tokens = {
    ...currentTokens,
    [authState]: token,
  };
  return authState;
};
