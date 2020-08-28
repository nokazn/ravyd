import { Context } from '@nuxt/types';
import { ServerAPI } from '~~/types';

export const login = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Login | undefined> => {
    const request = app.$serverApi.$post('/auth/login')
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });

    return request;
  };
};
