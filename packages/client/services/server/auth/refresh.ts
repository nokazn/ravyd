import type { Context } from '@nuxt/types';
import type { AxiosError } from 'axios';
import type { paths, JSONResponseOf } from 'shared/types';

type Path = paths['/auth/refresh']['put'];
type RequestBody = Path['requestBody']['content']['application/json'];
type Response = JSONResponseOf<Path>;

export const refresh = (context: Context) => {
  const { app } = context;

  return ({ accessToken, authState }: RequestBody): Promise<Response> => {
    return app.$serverApi.$put<Response, RequestBody>('/auth/refresh', {
      accessToken,
      authState,
    })
      .catch((err: AxiosError<Response>) => {
        console.error({ err });
        throw err;
      });
  };
};
