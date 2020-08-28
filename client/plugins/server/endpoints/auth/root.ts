import { Context } from '@nuxt/types';
import { ServerAPI } from '~~/types';

export const root = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Token | undefined> => {
    const request = app.$serverApi.$get('/auth')
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });

    return request;
  };
};
