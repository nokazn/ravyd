import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { ServerAPI } from 'shared/types';

export const callback = (context: Context) => {
  const { app } = context;

  return ({ code, state }: {
    code: string;
    state: string;
  }): Promise<ServerAPI.Auth.Token> => {
    // TODO: path
    return app.$serverApi.$get<ServerAPI.Auth.Token>('/auth/login/callback', {
      params: {
        code,
        state,
      },
    }).catch((err: AxiosError<ServerAPI.Auth.Token>) => {
      console.error({ err });
      return err.response?.data ?? {
        accessToken: undefined,
        expireIn: 0,
      };
    });
  };
};
