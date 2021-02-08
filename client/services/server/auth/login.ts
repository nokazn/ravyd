import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { paths, JSONResponseOf } from 'shared/types';

type Response = JSONResponseOf<paths['/auth/login']['post']>;

export const login = (context: Context) => {
  const { app } = context;

  return (): Promise<Response> => {
    return app.$serverApi.$post<Response>('/auth/login')
      .catch((err: AxiosError<Response>) => {
        console.error({ err });
        return err.response?.data ?? {
          code: app.$constant.UNEXPECTED_ERROR_CODE,
          message: err.message,
          authState: null,
          accessToken: null,
          expireIn: 0,
          url: null,
          authenticated: false,
        };
      });
  };
};
