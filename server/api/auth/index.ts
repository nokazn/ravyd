import express from 'express';
import dotenv from 'dotenv';

// '@' のような alias は serverMiddleware では動作しない
import session from '../../auth/session';
import { createUrl } from '../../../utils/createUrl';
import { generateRandomString } from '../../../utils/generateRandomString';
import { getAccessToken } from '../../auth/getAccessToken';
import { refreshAccessToken } from '../../auth/refreshAccessToken';

dotenv.config();

const app: express.Express = express();

app.use(express.json());
app.use(session);

app.get('/', (_req, res) => {
  console.log(_req.session);
  if (process.env.SPOTIFY_CLIENT_ID == null || process.env.BASE_URL == null) {
    console.error(
      '環境変数が設定されていません。',
      JSON.stringify({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        baseUrl: process.env.BASE_URL,
      }, null, 2),
    );

    return res.send(500).send('エラーが発生しました。\n');
  }

  const baseUrl = 'https://accounts.spotify.com/authorize';
  const state = generateRandomString();
  const scope = 'user-read-private user-read-email';
  const url = createUrl(baseUrl, {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.BASE_URL}/login/callback`,
    state,
    scope,
  });

  return res.redirect(url);
});

app.post('/refresh', async (_req, res) => {
  const refreshToken = '';
  const token = await refreshAccessToken(refreshToken);
  return res.status(200).send(token);
});

app.post('/callback', async (req, res) => {
  const { code }: { code?: string } = req.query;

  if (code == null) {
    const { error }: { error?: string} = req.query;
    console.error(
      'code が取得できませんでした。',
      JSON.stringify({
        req,
        res,
        code,
      }, null, 2),
    );

    return res.status(400).send(error || '認証時にエラーが発生しました。\n');
  }

  const token = await getAccessToken(code);

  return res.send(token);
});

app.use((_req, res) => res.status(404).send('An error occurred.\n'));

export default {
  path: '/api/auth/',
  handler: app,
};
