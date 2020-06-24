import { Context } from '@nuxt/types';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import {
  TITLE_MAP,
  ReleaseType,
  ReleaseTitle,
  ReleaseInfo,
} from './index';

export type ArtistReleaseInfo = {
  [k in ReleaseType]: ReleaseInfo<k>
}

const getReleaseListHandler = ({ app, params }: Context) => async <T extends ReleaseType>(
  releaseType: T,
  artworkSize: number,
  limit: number,
  offset?: number,
): Promise<ReleaseInfo<T>> => {
  const title: ReleaseTitle<T> = TITLE_MAP[releaseType];

  const country = app.$getters()['auth/userCountryCode'];
  const releases = await app.$spotify.artists.getArtistAlbums({
    artistId: params.artistId,
    country,
    includeGroupList: [releaseType],
    limit,
    offset,
  });
  const items = releases?.items.map(convertReleaseForCard(artworkSize)) ?? [];

  const isFull = releases?.next == null;
  const total = releases?.total ?? 0;

  return {
    title,
    items,
    isFull,
    total,
    isAbbreviated: true,
  };
};

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
