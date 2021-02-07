import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { ServerAPI } from 'shared/types';

export const root = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Token> => {
    return app.$serverApi.$get<ServerAPI.Auth.Token>('/auth')
      .catch((err: AxiosError) => {
        console.error({ err });
        return err.response?.data ?? {};
      });
  };
};
