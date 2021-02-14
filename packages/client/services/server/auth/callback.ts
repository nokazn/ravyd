import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { paths, JSONResponseOf } from 'shared/types';

type Path = paths['/auth/login/callback']['get'];
type Params = Path['parameters']['query'];
type Response = JSONResponseOf<Path>;

export const callback = (context: Context) => {
  const { app } = context;

  return ({ code, state }: Params): Promise<Response> => {
    return app.$serverApi.$get<Response, Params>('/auth/login/callback', {
      params: {
        code,
        state,
      },
    }).catch((err: AxiosError<Response>) => {
      console.error({ err });
      return err.response?.data ?? {
        code: app.$constant.UNEXPECTED_ERROR_CODE,
        message: err.message,
        authState: null,
        accessToken: null,
        expireIn: 0,
      };
    });
  };
};
