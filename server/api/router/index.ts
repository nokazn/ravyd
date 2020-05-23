import express from 'express';

import redisClient from '../../../db/redis';
import { createUrl } from '../../../utils/createUrl';
import { generateRandomString } from '../../../utils/generateRandomString';
import { getAccessToken } from '../../auth/getAccessToken';
import { refreshAccessToken } from '../../auth/refreshAccessToken';
import { SpotifyAPI } from '~~/types';

const router = express.Router();

router.get('/auth', async (req, res) => {
  const data = await redisClient.get(req.sessionID!);
  if (data != null) {
    const token: SpotifyAPI.Auth.TokenResponseData = JSON.parse(data);
    return res.send({ access_token: token.access_token });
  }

  if (process.env.SPOTIFY_CLIENT_ID == null || process.env.BASE_URL == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        baseUrl: process.env.BASE_URL,
      }, null, 2),
    );
    return res.status(500).send('エラーが発生しました。\n');
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

router.get('/auth/refresh', async (req, res) => {
  const data = await redisClient.get(req.sessionID!);
  if (data == null) {
    return res.redirect('/auth');
  }

  const currentToken: SpotifyAPI.Auth.TokenResponseData = JSON.parse(data);
  const token = await refreshAccessToken(currentToken.refresh_token!);
  if (token == null) {
    return res.redirect('/auth');
  }
  console.log({
    token,
    currentToken,
  });
  redisClient.set(req.sessionID!, JSON.stringify({
    ...currentToken,
    ...token,
  }));

  return res.send(token?.access_token);
});

router.post('/auth/callback', async (req, res) => {
  const { code }: { code?: string } = req.body;

  if (typeof code !== 'string') {
    const { error }: { error?: string } = req.query;
    console.error(
      'code が取得できませんでした。',
      JSON.stringify({
        // req,
        // res,
        code,
      }, null, 2),
    );

    return res.status(400).send(error || '認証時にエラーが発生しました。\n');
  }

  const token = await getAccessToken(code);
  redisClient.set(req.sessionID!, JSON.stringify(token));

  return res
    .cookie('accessToken', token?.access_token, {
      maxAge: 1000 * 60 * 15,
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
    })
    .send(token?.access_token);
});

export default router;
