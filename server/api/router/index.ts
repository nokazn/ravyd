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

/**
 * @return { accessToken: string | undefined, expireIn: number }
 */
router.get('/auth', auth);

/**
 * @return {
 *  { accessToken: string, expireIn: number } | { uri: string } | { message: string }
 * }
 */
router.post('/auth/login', login);

/**
 * @return {
 *   { accessToken: string, expireIn: number } | { message: string }
 * }
 */
router.post('/auth/login/callback', callback);

/**
 * @return {
 *  { accessToken: string | expireIn: number } | { message: string }
 * }
 */
router.post('/auth/refresh', refresh);


/**
 * @return { void }
 */
router.post('/auth/logout', logout);

export default router;
