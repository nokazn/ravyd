import { Context } from '@nuxt/types';
import { SpotifyAPI } from '~~/types';

export const getRelatedArtistList = async (
  { app, params }: Context,
): Promise<SpotifyAPI.Artist[]> => {
  const { artistId } = params;
  const { artists } = await app.$spotify.artists.getRelatedArtists({ artistId });
  return artists ?? [];
};
