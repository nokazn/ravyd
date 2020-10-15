import { Context } from '@nuxt/types';

export const logout = (context: Context) => {
  const { app } = context;

  return (): Promise<void> => {
    const request = app.$serverApi.$post('/auth/logout')
      .catch((err: Error) => {
        console.error({ err });
        throw new Error(err.message);
      });

    return request;
  };
};
