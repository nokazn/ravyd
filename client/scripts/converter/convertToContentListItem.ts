import { generateContentPath } from '~/scripts/text/generateContentPath';
import { App, SpotifyAPI } from '~~/types';

export const convertToContentListItem = <T extends App.ContentItemType>(type: T) => (
  item: App.ContentItems[T],
): App.ContentItemInfo<T> => {
  const {
    id,
    name,
    uri,
    external_urls: externalUrls,
  } = item;

  type OneLineItem = SpotifyAPI.Artist
    | SpotifyAPI.SimplePlaylist
    | SpotifyAPI.SimpleShow
    | SpotifyAPI.SimpleEpisode;
  const getOneLineItem = (oneLineItem: OneLineItem) => ({
    releaseId: id,
    images: oneLineItem.images,
    to: generateContentPath(type, id),
  });

  type CommonPropKey = 'type' | 'id' | 'name' | 'uri' | 'externalUrls';
  const info: { [k in App.ContentItemType]: () => Omit<App.ContentItemInfo<k>, CommonPropKey> } = {
    track() {
      const { album } = item as SpotifyAPI.Track;
      return {
        releaseId: album.id,
        images: album.images,
        artists: album.artists,
        to: generateContentPath('track', album.id, id),
      };
    },
    album() {
      const album = item as SpotifyAPI.SimpleAlbum;
      return {
        releaseId: id,
        images: album.images,
        artists: album.artists,
        to: generateContentPath('album', id),
      };
    },
    artist() {
      return getOneLineItem(item as SpotifyAPI.Artist);
    },
    playlist() {
      return getOneLineItem(item as SpotifyAPI.SimplePlaylist);
    },
    show() {
      return getOneLineItem(item as SpotifyAPI.SimpleShow);
    },
    episode() {
      return getOneLineItem(item as SpotifyAPI.SimpleEpisode);
    },
  };

  return {
    type,
    id,
    name,
    uri,
    externalUrls,
    ...info[type](),
  };
};
