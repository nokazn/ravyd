import { SpotifyAPI } from '~~/types';

export type TrackInfo = {
  type: SpotifyAPI.Track['type']
  name: SpotifyAPI.Track['name']
  id: SpotifyAPI.Track['id']
  releaseId: SpotifyAPI.Track['album']['id']
  uri: SpotifyAPI.Track['uri']
  artists: {
    name: SpotifyAPI.Artist['name'],
    id: SpotifyAPI.Artist['id'],
  }[]
  src: SpotifyAPI.Image['url'],
}

export const parseTrack = (track: SpotifyAPI.Track): TrackInfo => ({
  type: track.type,
  name: track.name,
  id: track.id,
  releaseId: track.album.id,
  uri: track.uri,
  artists: track.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  src: track.album.images[0].url,
});
