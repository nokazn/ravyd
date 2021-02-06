import cookie from 'cookie-parser';
import { SESSION_SECRET } from '../config/constants';

export const cookieParser = cookie(SESSION_SECRET);
