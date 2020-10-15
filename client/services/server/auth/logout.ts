import { Context } from '@nuxt/types';

export const logout = (context: Context) => {
  const { app } = context;

  return (): Promise<void> => {
    return app.$serverApi.$post('/auth/logout')
      .catch((err: Error) => {
        console.error({ err });
        throw err;
      });
  };
};
