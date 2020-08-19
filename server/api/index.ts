import express from 'express';

// @ のような alias は serverMiddleware では動作しない
import { cookieParser, session } from '../middleware';
import router from './router';

const app = express();

app.use(express.json());
app.use(cookieParser);
app.use(session);
app.use('/', router);

app.use((_req, res) => res.status(404).send('An error occurred.\n'));

export default {
  path: '/api/',
  handler: app,
};
