// Must be first line
import '../pre-start';

import express from 'express';
import helmet from 'helmet';

import { cookieParser, session } from '@/middleware';
import { logger } from '@/helper';
import router from '@/router/v1';
import { PORT } from '@/config/constants';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(helmet());
app.use(session);
app.use('/api/v1', router);

app.use((_, res) => {
  res.status(404).send({
    message: 'NOT FOUND',
  });
});

app.listen(parseInt(PORT, 10), () => {
  logger.info(`Listening at http://localhost:${PORT}`);
});
