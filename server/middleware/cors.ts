import c from 'cors';
import { CLIENT_ORIGIN } from '@/config/constants';

export const cors = c({
  origin: CLIENT_ORIGIN,
  credentials: true,
});
