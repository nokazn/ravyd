import { Request, Response } from 'express';

import redisClient from '../../../../../db/redis';
import { refreshAccessToken } from '../../../../auth/refreshAccessToken';
import { createUrl } from '../../../../../utils/createUrl';
import { generateRandomString } from '../../../../../utils/generateRandomString';
import { TOKEN_EXPIRE_IN } from '../../index';
import { SpotifyAPI } from '~~/types';

export const login = (req: Request, res: Response) => {
  if (req.session == null || req.sessionID == null) {
    return res.status(401).send({ message: 'トークンを更新できませんでした。' });
  }

  const currentSessionId = req.sessionID;
  return req.session.regenerate(async (err) => {
    if (err != null) {
      return console.error({ err });
    }

    const tokenInRedis = await redisClient.get(req.sessionID!);
    // リフレッシュトークンが存在していた場合はそれを更新
    if (tokenInRedis != null) {
      const currentToken: SpotifyAPI.Auth.TokenResponseData = JSON.parse(tokenInRedis);
      if (currentToken.refresh_token != null) {
        const token = await refreshAccessToken(currentToken.refresh_token);
        if (token == null) {
          return res.status(500).send({ message: 'トークンを更新できませんでした。' });
        }

        await Promise.all([
          redisClient.del(currentSessionId),
          redisClient.set(req.sessionID!, JSON.stringify({
            ...currentToken,
            ...token,
          })),
        ]);

        return res.send({
          accessToken: token.access_token,
          expireIn: TOKEN_EXPIRE_IN,
        });
      }
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyBaseUrl = process.env.BASE_URL;
    if (clientId == null || spotifyBaseUrl == null) {
      console.error(
        '環境変数が設定されていません。',
        JSON.stringify({
          clientId,
          spotifyBaseUrl,
        }, null, 2),
      );
      return res.status(500).send({ message: 'エラーが発生しました。' });
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
  });
};
