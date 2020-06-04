import express from 'express';

// @ のような alias は serverMiddleware では動作しない
import session from '../auth/session';
import router from './router';

const app = express();

app.use(express.json());
app.use(session);
app.use('/', router);

app.use((_req, res) => res.status(404).send('An error occurred.\n'));

export default {
  path: '/api/',
  handler: app,
};
