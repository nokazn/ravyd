import urljoin from 'url-join';
import crypto from 'crypto';
import type { FastifyRequest, FastifySchema } from 'fastify';

import { createUrl } from 'shared/utils/createUrl';
import type { paths, JSONResponseOf } from 'shared/types';
import { upsertToken, refreshAccessToken } from '@/helper';
import {
  CLIENT_ORIGIN,
  SPOTIFY_CLIENT_ID,
  TOKEN_EXPIRE_IN,
  SPOTIFY_AUTHORIZE_BASE_URL,
} from '@/config/constants';

type ResponseBody = JSONResponseOf<paths['/auth/login']['post']>;

const handler = async (req: FastifyRequest): Promise<ResponseBody> => {
  const { refreshToken } = req.session;
  // リフレッシュトークンが存在していた場合はそれを更新
  if (refreshToken != null) {
    const token = await refreshAccessToken(refreshToken);
    if (token != null) {
      const authState = upsertToken(req, token, { refreshToken });
      return {
        code: 'OK',
        message: 'Current refresh token is valid.',
        authenticated: true,
        authState,
        accessToken: token.access_token,
        expireIn: TOKEN_EXPIRE_IN,
        url: null,
      };
    }
    req.log.warn('Failed to update an access token when logging in. Need to authorize to Spotify again.', {
      session: req.session,
      token,
    });
  }

  // TODO:
  const state = crypto.randomBytes(100).toString('base64');
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'streaming',
    'user-modify-playback-state',
    'playlist-modify-public',
    'playlist-modify-private',
    'ugc-image-upload',
    'user-library-read',
    'user-library-modify',
    'user-top-read',
    'user-read-playback-position',
    'user-read-currently-playing',
    'user-read-recently-played',
    'playlist-read-private',
    'user-follow-read',
    'user-follow-modify',
  ].join(' ');
  const url = createUrl(urljoin(SPOTIFY_AUTHORIZE_BASE_URL, '/authorize'), {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: urljoin(CLIENT_ORIGIN, '/login/callback'),
    state,
    scope,
  });

  req.session.state = state;
  return {
    code: 'OK',
    authenticated: false,
    message: 'Needs to authorize with Spotify.',
    authState: null,
    accessToken: null,
    expireIn: 0,
    url,
  };
};

const schema: FastifySchema = {};

export const login = {
  handler,
  schema,
};
