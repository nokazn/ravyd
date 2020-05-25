import { Context } from '@nuxt/types';

import { parseReleaseForCard } from '~/scripts/parser/parseReleaseForCard';
import { App } from '~~/types';

export type ArtistReleaseInfo = {
  albums: {
    title: 'アルバム'
    items: App.ReleaseCardInfo[] | undefined
  }
  singles: {
    title: 'シングル・EP'
    items: App.ReleaseCardInfo[] | undefined
  }
  compilations: {
    title: 'コンピレーション'
    items: App.ReleaseCardInfo[] | undefined
  }
  appearsOns: {
    title: '参加作品'
    items: App.ReleaseCardInfo[] | undefined
  }
}

export const getReleaseListMap = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<ArtistReleaseInfo | null> => {
  const country = app.$state().auth.userData?.country;
  if (country == null) return null;

  const getArtistReleases = (
    releaseType: App.ReleaseCardInfo['releaseType'],
    offset?: number,
  ) => app.$spotify.artists.getArtistAlbums({
    artistId: params.artistId,
    country,
    limit: 20,
    includeGroupList: [releaseType],
    offset,
  });

  const [albums, singles, compilations, appearsOns] = await Promise.all([
    getArtistReleases('album'),
    getArtistReleases('single'),
    getArtistReleases('compilation'),
    getArtistReleases('appears_on'),
  ] as const);

  const albumList = albums?.items.map(parseReleaseForCard(artworkSize));
  const singleList = singles?.items.map(parseReleaseForCard(artworkSize));
  const compilationList = compilations?.items.map(parseReleaseForCard(artworkSize));
  const appearsOnList = appearsOns?.items.map(parseReleaseForCard(artworkSize));

  return {
    albums: {
      title: 'アルバム',
      items: albumList,
    },
    singles: {
      title: 'シングル・EP',
      items: singleList,
    },
    compilations: {
      title: 'コンピレーション',
      items: compilationList,
    },
    appearsOns: {
      title: '参加作品',
      items: appearsOnList,
    },
  };
};
