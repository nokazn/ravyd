import { Context } from '@nuxt/types';
import { AxiosError } from 'axios';
import { ServerAPI } from '~~/types';

export const root = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Token> => {
    const request = app.$serverApi.$get('/auth')
      .catch((err: AxiosError) => {
        console.error({ err });
        return err.response?.data ?? {};
      });

    return request;
  };
};
