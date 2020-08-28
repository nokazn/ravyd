import { Context } from '@nuxt/types';
import { AxiosResponse } from 'axios';
import { ServerAPI } from '~~/types';

export const refresh = (context: Context) => {
  const { app } = context;

  // status も見たいので $serverApi.$post 出なく、$serverApi.post で呼び出してる
  return (accessToken: string): Promise<AxiosResponse<ServerAPI.Auth.Token> | undefined> => {
    const request = app.$serverApi.post('/auth/refresh', { accessToken })
      .catch((err: Error) => {
        console.error({ err });
        return undefined;
      });

    return request;
  };
};
