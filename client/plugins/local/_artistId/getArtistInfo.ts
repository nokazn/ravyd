import { Context } from '@nuxt/types';
import { addComma } from '~~/utils/addComma';
import { App } from '~~/types';

export const getArtistInfo = async (
  { app, params }: Context,
): Promise<App.ArtistInfo | undefined> => {
  const artist = await app.$spotify.artists.getArtist({
    artistId: params.artistId,
  });
  if (artist == null) return undefined;

  const {
    name,
    id,
    uri,
    images: avatarList,
    followers,
    genres: genreList,
    external_urls: externalUrls,
  } = artist;
  const followersText = followers.total != null
    ? `フォロワー ${addComma(followers.total)}人`
    : undefined;

  return {
    name,
    id,
    uri,
    avatarList,
    followersText,
    genreList,
    externalUrls,
  };
};
