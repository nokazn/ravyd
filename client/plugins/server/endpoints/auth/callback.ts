import { Context } from '@nuxt/types';
import { ServerAPI } from '~~/types';

export const callback = (context: Context) => {
  const { app } = context;

  return ({ code, state }: {
    code: string;
    state: string;
  }): Promise<ServerAPI.Auth.Token | undefined> => {
    // @todo path
    const request = app.$serverApi.$get('/auth/login/callback', {
      params: {
        code,
        state,
      },
    }).catch((err: Error) => {
      console.error({ err });
      return undefined;
    });

    return request;
  };
};
