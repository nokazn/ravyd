import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const parseArtistForCard = (avatarSize?: number) => (
  artist: SpotifyAPI.Artist,
): App.ArtistCardInfo => ({
  name: artist.name,
  id: artist.id,
  uri: artist.uri,
  avatarSrc: getImageSrc(artist.images, avatarSize),
  width: avatarSize,
});
