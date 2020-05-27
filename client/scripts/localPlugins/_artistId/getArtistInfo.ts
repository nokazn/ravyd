import { Context } from '@nuxt/types';
import { addComma } from '~~/utils/addComma';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

export const getArtistInfo = async (
  { app, params }: Context,
  avatarSize: number,
): Promise<App.ArtistInfo | null> => {
  const artist = await app.$spotify.artists.getArtist({
    artistId: params.artistId,
  });
  if (artist == null) return null;

  const {
    name,
    id,
    uri,
    images,
    followers,
  } = artist;
  const avatarSrc = getImageSrc(images, avatarSize);
  const followersText = `フォロワー ${addComma(followers.total)}人`;

  return {
    name,
    id,
    uri,
    avatarSrc,
    followersText,
  };
};
