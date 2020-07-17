import { SpotifyAPI, App } from '~~/types';

export const convertPlaylistForCard = (
  playlist: SpotifyAPI.SimplePlaylist | SpotifyAPI.Playlist,
): App.PlaylistCardInfo => {
  const info = {
    id: playlist.id,
    name: playlist.name,
    uri: playlist.id,
    description: playlist.description,
    externalUrls: playlist.external_urls,
    artworkList: playlist.images,
  };

  return info;
};
