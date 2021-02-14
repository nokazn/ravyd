import type { Context } from '@nuxt/types';
import { auth } from './auth';

export const server = (context: Context) => ({
  auth: auth(context),
});

const endpoints = (context: Context) => server(context);
export type ServerServices = ReturnType<typeof endpoints>;
