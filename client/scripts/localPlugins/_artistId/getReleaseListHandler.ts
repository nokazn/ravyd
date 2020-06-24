import { Context } from '@nuxt/types';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { ReleaseType } from './index';
import { App } from '~~/types';

export const getReleaseListHandler = ({ app, params }: Context) => async <T extends ReleaseType>(
  {
    type,
    artworkSize,
    counts,
    offset,
  }: {
    type: T,
    artworkSize: number,
    counts: number,
    offset: number,
  },
): Promise<App.ReleaseCardInfo[]> => {
  const country = app.$getters()['auth/userCountryCode'];
  const limit = 50;
  const handlerCounts = Math.ceil(counts / limit);

  const handler = async (index: number): Promise<App.ReleaseCardInfo[]> => {
    const releases = await app.$spotify.artists.getArtistAlbums({
      artistId: params.artistId,
      country,
      includeGroupList: [type],
      limit,
      offset: offset + limit * index,
    });
    const items = releases?.items.map(convertReleaseForCard(artworkSize)) ?? [];

    return items;
  };

  const releaseList = await Promise.all(new Array(handlerCounts)
    .fill(undefined)
    .map((_, index) => handler(index)))
    .then((releaseLists) => releaseLists.flat());

  return releaseList;
};
