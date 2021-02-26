import corsMiddleware from 'cors';
import { ALLOWED_ORIGIN } from '@/config/constants';

export const cors = corsMiddleware({
  origin: ALLOWED_ORIGIN,
  credentials: true,
});
