import { Context } from '@nuxt/types';

import { getReleaseListHandler } from '~/scripts/localPlugins/_artistId';
import { ReleaseInfo, ReleaseType } from './getReleaseListHandler';

export type ArtistReleaseInfo = {
  [k in ReleaseType]: ReleaseInfo<k>
}

export const getReleaseListMap = async (
  context: Context,
  artworkSize: number,
  limit: number,
): Promise<ArtistReleaseInfo> => {
  const getReleaseList = getReleaseListHandler(context);

  const [album, single, compilation, appears_on] = await Promise.all([
    getReleaseList('album', artworkSize, limit),
    getReleaseList('single', artworkSize, limit),
    getReleaseList('compilation', artworkSize, limit),
    getReleaseList('appears_on', artworkSize, limit),
  ] as const);

  return {
    album,
    single,
    compilation,
    appears_on,
  };
};
