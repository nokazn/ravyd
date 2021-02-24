// Must be at first line
// eslint-disable-next-line import/order
import { httpsServerOptions } from './pre-start';

import express from 'express';
import https from 'https';
import helmet from 'helmet';
import * as path from 'path';

import { logger } from 'shared/logger';
import { cors, cookieParser, session } from '@/middleware';
import router from '@/router/v1';
import { PORT, HOST, SERVER_API_PREFIX } from '@/config/constants';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(helmet());
app.use(cors);
app.use(session);
app.use(path.resolve(`/${SERVER_API_PREFIX}`), router);

app.use((_, res) => {
  res.status(404).send({
    message: 'NOT FOUND',
  });
});

if (httpsServerOptions != null) {
  const server = https.createServer(httpsServerOptions, app);
  server.listen(PORT, HOST, () => {
    logger.info(`Listening at https://${HOST}:${PORT}`);
  });
} else {
  app.listen(PORT, HOST, () => {
    logger.info(`Listening at http://${HOST}:${PORT}`);
  });
}

