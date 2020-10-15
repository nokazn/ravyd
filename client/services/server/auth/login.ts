import { Context } from '@nuxt/types';
import { AxiosError } from 'axios';
import { ServerAPI } from '~~/types';

export const login = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Login> => {
    return app.$serverApi.$post('/auth/login')
      .catch((err: AxiosError<ServerAPI.Auth.Login>) => {
        console.error({ err });
        return err.response?.data ?? {};
      });
  };
};
