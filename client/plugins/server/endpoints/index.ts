import { Context } from '@nuxt/types';

import { auth } from './auth';

export const endpoints = (context: Context) => ({
  auth: auth(context),
});

const serverEndpoints = (context: Context) => endpoints(context);
export type ServerEndpoints = ReturnType<typeof serverEndpoints>;
