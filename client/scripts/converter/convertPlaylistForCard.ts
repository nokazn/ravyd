import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const convertPlaylistForCard = (artworkSize?: number) => (
  playlist: SpotifyAPI.SimplePlaylist | SpotifyAPI.Playlist,
): App.PlaylistCardInfo => ({
  id: playlist.id,
  name: playlist.name,
  description: playlist.description,
  uri: playlist.uri,
  artworkSrc: getImageSrc(playlist.images, artworkSize),
});
