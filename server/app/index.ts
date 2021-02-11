// Must be at first line
import '../pre-start';

import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';

import { logger } from 'shared/logger';
import { cors, cookieParser, session } from '@/middleware';
import router from '@/router/v1';
import { PORT, ROOT_PATH } from '@/config/constants';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(helmet());
app.use(cors);
app.use(session);
app.use('/api/v1', router);

app.use((_, res) => {
  res.status(404).send({
    message: 'NOT FOUND',
  });
});


if (process.env.NODE_ENV === 'development') {
  const server = https.createServer({
    key: fs.readFileSync(path.join(ROOT_PATH, 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(ROOT_PATH, 'localhost.pem')),
  }, app);
  server.listen(PORT, '127.0.0.1', () => {
    logger.info(`Listening at https://127.0.0.1:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    logger.info(`Listening at http://localhost:${PORT}`);
  });
}

