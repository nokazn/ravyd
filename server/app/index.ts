import express from 'express';
import { cookieParser, session } from '../middleware';
import router from '../router/v1';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(express.json());
app.use(cookieParser);
app.use(session);
app.use('/api/v1', router);

app.use((_, res) => {
  res.status(404).send({
    message: 'NOT FOUND',
  });
});

app.listen(PORT, () => {
  console.info(`Listening at http://localhost:${PORT}`);
});
