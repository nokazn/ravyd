import { Context } from '@nuxt/types';
import { addComma } from '~~/utils/addComma';
import { getImageSrc } from '~/scripts/parser/getImageSrc';

export type ArtistInfo = {
  name: string
  id: string
  uri: string
  avatarSrc: string
  avatarAlt: string
  followersText: string
}

export const getArtistInfo = async ({ app, params }: Context): Promise<ArtistInfo | null> => {
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
  const avatarSize = 220;
  const avatarSrc = getImageSrc(images, avatarSize);
  const avatarAlt = `the avatar of ${name}`;
  const followersText = `フォロワー ${addComma(followers.total)}人`;

  return {
    name,
    id,
    uri,
    avatarSrc,
    avatarAlt,
    followersText,
  };
};
