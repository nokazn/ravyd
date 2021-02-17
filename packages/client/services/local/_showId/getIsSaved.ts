import type { Context } from '@nuxt/types';

export const getIsSaved = async ({ app, params }: Context): Promise<boolean> => {
  const [isSaved] = await app.$spotify.library.checkUserSavedShows({
    showIdList: [params.showId],
  });

  return isSaved;
};
