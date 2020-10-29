import { Context } from '@nuxt/types';
import { App } from '~~/types';
import { getFollowersText } from '~/services/converter';

export const getArtist = async (
  { app, params }: Context,
): Promise<App.ArtistPage | undefined> => {
  const artist = await app.$spotify.artists.getArtist({ artistId: params.artistId });
  if (artist == null) return undefined;

  const {
    name,
    id,
    uri,
    images,
    followers,
    genres: genreList,
    external_urls: externalUrls,
  } = artist;

  return {
    name,
    id,
    uri,
    images,
    followersText: getFollowersText(followers.total),
    genreList,
    externalUrls,
  };
};
