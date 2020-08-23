import express from 'express';
import dotenv from 'dotenv';

import { auth } from './auth';
import { login } from './auth/login';
import { callback } from './auth/login/callback';
import { refresh } from './auth/refresh';
import { logout } from './auth/logout';

dotenv.config();

const router = express.Router();

// 10分でトークンを更新させる
export const TOKEN_EXPIRE_IN = 1000 * 60 * 10;

router.get('/auth', auth);

router.post('/auth/login', login);

router.get('/auth/login/callback', callback);

router.post('/auth/refresh', refresh);

router.post('/auth/logout', logout);

export default router;
