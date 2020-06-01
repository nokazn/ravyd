import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const convertArtistForCard = (avatarSize?: number) => (
  artist: SpotifyAPI.Artist,
): App.ArtistCardInfo => ({
  name: artist.name,
  id: artist.id,
  uri: artist.uri,
  avatarSrc: getImageSrc(artist.images, avatarSize),
});
