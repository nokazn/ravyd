import { SpotifyAPI } from '~~/types';

export type ArtistInfo = {
  name: SpotifyAPI.Artist['name'],
  id: SpotifyAPI.Artist['id'],
  src: SpotifyAPI.Image['url'],
}[]

export const parseArtist = (artist: SpotifyAPI.Artist) => ({
  name: artist.name,
  id: artist.id,
  src: artist.images[0].url,
});
