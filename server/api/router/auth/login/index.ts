import { Request, Response } from 'express';

import { refreshAccessToken } from '../../../../auth/refreshAccessToken';
import { createUrl } from '../../../../../utils/createUrl';
import { generateRandomString } from '../../../../../utils/generateRandomString';
import { TOKEN_EXPIRE_IN } from '../../index';
import { SpotifyAPI, ServerAPI } from '~~/types';

type RequestParams = {}

type ResponseBody = ServerAPI.Auth.Login

export const login = async (req: Request<RequestParams>, res: Response<ResponseBody>) => {
  if (req.session == null) {
    console.error(JSON.stringify(req.session, undefined, 2));

    return res.status(401).send({
      accessToken: undefined,
      expireIn: 0,
      message: 'トークンを更新できませんでした。',
    });
  }

  const currentToken: SpotifyAPI.Auth.Token | undefined = req.session?.token;
  // リフレッシュトークンが存在していた場合はそれを更新
  if (currentToken?.refresh_token != null) {
    const token = await refreshAccessToken(currentToken.refresh_token);
    if (token == null) {
      console.error(JSON.stringify({
        session: req.session,
        currentToken,
        token,
      }, undefined, 2));

      return res.status(400).send({
        accessToken: undefined,
        expireIn: 0,
        message: 'トークンを更新できませんでした。',
      });
    }

    req.session.token = {
      ...req.session.token,
      ...token,
    };

    return res.send({
      accessToken: token.access_token,
      expireIn: TOKEN_EXPIRE_IN,
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const spotifyBaseUrl = process.env.BASE_URL;
  if (clientId == null || spotifyBaseUrl == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify(process.env, undefined, 2),
    );
    return res.status(500).send({
      message: 'エラーが発生しました。',
      accessToken: undefined,
      expireIn: 0,
    });
  }

  // 認可用のページの URL を返す
  const baseUrl = 'https://accounts.spotify.com/authorize';
  const state = generateRandomString();
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

  const url = createUrl(baseUrl, {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: `${spotifyBaseUrl}/login/callback`,
    state,
    scope,
  });

  return res.send({ url });
};
