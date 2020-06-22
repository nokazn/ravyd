import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI, App } from '~~/types';

export const convertPlaylistForCard = (artworkSize?: number) => (
  playlist: SpotifyAPI.SimplePlaylist | SpotifyAPI.Playlist,
): App.PlaylistCardInfo => {
  const {
    id,
    name,
    uri,
    description,
    external_urls: externalUrls,
  } = playlist;
  const artworkSrc = getImageSrc(playlist.images, artworkSize);

  return {
    id,
    name,
    uri,
    description,
    externalUrls,
    artworkSrc,
  };
};
