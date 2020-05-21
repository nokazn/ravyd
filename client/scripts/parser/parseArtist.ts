import { SpotifyAPI } from '~~/types';

export type ArtistInfo = {
  name: SpotifyAPI.Artist['name'],
  id: SpotifyAPI.Artist['id'],
  uri: SpotifyAPI.Artist['uri'],
  src: SpotifyAPI.Image['url'],
}[]

export const parseArtist = (artist: SpotifyAPI.Artist) => ({
  name: artist.name,
  id: artist.id,
  uri: artist.uri,
  src: artist.images[0].url,
});
