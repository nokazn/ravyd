import { v4 as uuid4 } from 'uuid';
import type { FastifyRequest } from 'fastify';
import { SpotifyAPI } from 'shared/types';

type Params = {
  authState: string;
  refreshToken?: undefined;
} | {
  authState?: undefined;
  refreshToken: string;
}

const generateAuthStateKey = () => {
  const key = uuid4();
  // TODO:
  // return uuid5(key, refreshToken);
  return key;
};

export const upsertToken = (
  req: FastifyRequest,
  token: SpotifyAPI.Auth.Token,
  params: Params,
): string => {
  const currentTokens = req.session.tokens ?? {};
  const authState = params.authState ?? generateAuthStateKey();
  if (params.refreshToken != null) {
    req.session.refreshToken = params.refreshToken;
  }
  req.session.tokens = {
    ...currentTokens,
    [authState]: token,
  };
  return authState;
};
