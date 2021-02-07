import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { ServerAPI } from 'shared/types';

export const login = (context: Context) => {
  const { app } = context;

  return (): Promise<ServerAPI.Auth.Login> => {
    return app.$serverApi.$post<ServerAPI.Auth.Login>('/auth/login')
      .catch((err: AxiosError<ServerAPI.Auth.Login>) => {
        console.error({ err });
        return err.response?.data ?? {
          accessToken: undefined,
          url: undefined,
        };
      });
  };
};
