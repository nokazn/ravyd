import { Context } from '@nuxt/types';
import { addComma } from '~~/utils/addComma';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

export const getArtistInfo = async (
  { app, params }: Context,
  avatarSize: number,
): Promise<App.ArtistInfo | undefined> => {
  const artist = await app.$spotify.artists.getArtist({
    artistId: params.artistId,
  });
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
  const avatarSrc = getImageSrc(images, avatarSize);
  const followersText = `フォロワー ${addComma(followers.total)}人`;

  return {
    name,
    id,
    uri,
    avatarSrc,
    followersText,
    genreList,
    externalUrls,
  };
};
