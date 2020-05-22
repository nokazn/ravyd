import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI } from '~~/types';

export type ArtistInfo = {
  name: SpotifyAPI.Artist['name'],
  id: SpotifyAPI.Artist['id'],
  uri: SpotifyAPI.Artist['uri'],
  src: SpotifyAPI.Image['url'],
}[]

export const parseArtist = (imageMinSize?: number) => (artist: SpotifyAPI.Artist) => ({
  name: artist.name,
  id: artist.id,
  uri: artist.uri,
  src: getImageSrc(artist.images, imageMinSize),
});
