import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI } from '~~/types';

export type AlbumInfo = {
  type: SpotifyAPI.Album['type']
  name: SpotifyAPI.Album['name']
  id: SpotifyAPI.Album['id']
  releaseId: SpotifyAPI.Album['id']
  uri: SpotifyAPI.Album['uri']
  artists: {
    name: SpotifyAPI.Artist['name'],
    id: SpotifyAPI.Artist['id'],
  }[]
  src: SpotifyAPI.Image['url'],
}

export const parseAlbum = (imageMinSize?: number) => (album: SpotifyAPI.Album): AlbumInfo => ({
  type: album.type,
  name: album.name,
  id: album.id,
  releaseId: album.id,
  uri: album.uri,
  artists: album.artists.map((artist) => ({
    name: artist.name,
    id: artist.id,
  })),
  src: getImageSrc(album.images, imageMinSize),
});
