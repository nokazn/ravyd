import express from 'express';
import dotenv from 'dotenv';

import redisClient from '../../../db/redis';
import { createUrl } from '../../../utils/createUrl';
import { generateRandomString } from '../../../utils/generateRandomString';
import { getAccessToken } from '../../auth/getAccessToken';
import { refreshAccessToken } from '../../auth/refreshAccessToken';
import { SpotifyAPI } from '~~/types';

dotenv.config();

const router = express.Router();

/**
 * @return { accessToken: string | undefined }
 */
router.get('/auth', async (req, res) => {
  const data = await redisClient.get(req.sessionID!);
  const token: SpotifyAPI.Auth.TokenResponseData = data != null
    ? JSON.parse(data)
    : {};

  res.send({ accessToken: token.access_token });
});

/**
 * @return {
 *  { accessToken: string } | { uri: string } | { message: string }
 * }
 */
router.post('/auth/login', async (req, res) => {
  const data = await redisClient.get(req.sessionID!);
  if (data != null) {
    const token: SpotifyAPI.Auth.TokenResponseData = JSON.parse(data);
    return res.send({ accessToken: token.access_token });
  }

  if (process.env.SPOTIFY_CLIENT_ID == null || process.env.BASE_URL == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        baseUrl: process.env.BASE_URL,
      }, null, 2),
    );
    return res.status(500).send({ message: 'エラーが発生しました。' });
  }

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
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.BASE_URL}/login/callback`,
    state,
    scope,
  });

  return res.send({ url });
});

/**
 * @return {
 *   { accessToken: string } | { message: string }
 * }
 */
router.post('/auth/login/callback', async (req, res) => {
  const { code }: { code?: string } = req.body;

  if (typeof code !== 'string') {
    const { error }: { error?: string } = req.query;
    console.error(
      'code が取得できませんでした。',
      JSON.stringify({ body: req.body, code }, null, 2),
    );

    return res.status(400).send({ message: error ?? '認証時にエラーが発生しました。\n' });
  }

  // code と token を交換する
  const token = await getAccessToken(code);
  redisClient.set(req.sessionID!, JSON.stringify(token));

  return res.send({ accessToken: token?.access_token });
});

/**
 * @todo
 * @return {
 *  { accessToken: string } | { message: string }
 * }
 */
router.post('/auth/refresh', async (req, res) => {
  const data = await redisClient.get(req.sessionID!);
  if (data == null) {
    return res.status(400).send({ message: 'トークンを更新できませんでした。\n' });
  }

  const currentToken: SpotifyAPI.Auth.TokenResponseData = JSON.parse(data);
  const token = await refreshAccessToken(currentToken.refresh_token!);
  if (token == null) {
    return res.status(400).send({ message: 'トークンを更新できませんでした。\n' });
  }

  console.log({
    token,
    currentToken,
  });
  redisClient.set(req.sessionID!, JSON.stringify({
    ...currentToken,
    ...token,
  }));

  return res.send({ accessToken: token.access_token });
});


/**
 * @return { void }
 */
router.post('/auth/logout', async (req) => {
  if (req.session != null) {
    req.session.destroy((err: Error) => {
      console.error({ err });
    });
  }
  await redisClient.del(req.sessionID!);
});

export default router;
