import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { ServerAPI } from 'shared/types';

export const refresh = (context: Context) => {
  const { app } = context;

  return (accessToken: string): Promise<ServerAPI.Auth.Token> => {
    return app.$serverApi.$post<ServerAPI.Auth.Token>('/auth/refresh', { accessToken })
      .catch((err: AxiosError<ServerAPI.Auth.Token>) => {
        console.error({ err });
        throw err;
      });
  };
};
