import { Context } from '@nuxt/types';

import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { App } from '~~/types';

export type ArtistReleaseInfo = {
  albums: {
    title: 'アルバム'
    items: App.ReleaseCardInfo[] | undefined
    isFull: boolean
  }
  singles: {
    title: 'シングル・EP'
    items: App.ReleaseCardInfo[] | undefined
    isFull: boolean
  }
  compilations: {
    title: 'コンピレーション'
    items: App.ReleaseCardInfo[] | undefined
    isFull: boolean
  }
  appearsOns: {
    title: '参加作品'
    items: App.ReleaseCardInfo[] | undefined
    isFull: boolean
  }
}
type ArtistReleaseTitle = ArtistReleaseInfo[keyof ArtistReleaseInfo]['title']

export const getReleaseListMap = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<ArtistReleaseInfo | undefined> => {
  const country = app.$getters()['auth/userCountryCode'];

  const getArtistReleases = async <T extends ArtistReleaseTitle>(
    releaseType: App.ReleaseCardInfo['releaseType'],
    offset?: number,
  ) => {
    const title = ({
      album: 'アルバム',
      single: 'シングル・EP',
      compilation: 'コンピレーション',
      appears_on: '参加作品',
    })[releaseType] as T;

    const releases = await app.$spotify.artists.getArtistAlbums({
      artistId: params.artistId,
      country,
      limit: 20,
      includeGroupList: [releaseType],
      offset,
    });
    const items = releases?.items.map(convertReleaseForCard(artworkSize));

    const isFull = releases?.next == null;

    return {
      title,
      items,
      isFull,
    };
  };

  const [albums, singles, compilations, appearsOns] = await Promise.all([
    getArtistReleases<'アルバム'>('album'),
    getArtistReleases<'シングル・EP'>('single'),
    getArtistReleases<'コンピレーション'>('compilation'),
    getArtistReleases<'参加作品'>('appears_on'),
  ] as const);

  return {
    albums,
    singles,
    compilations,
    appearsOns,
  };
};
