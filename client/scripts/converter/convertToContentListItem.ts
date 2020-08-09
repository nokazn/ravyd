import { generateContentPath } from '~/scripts/text/generateContentPath';
import { App, SpotifyAPI } from '~~/types';

export const convertToContentListItem = <T extends App.ContentItemType>(type: T) => (
  item: App.ContentItems[T],
): App.ContentItemInfo<T> => {
  const {
    id,
    name,
    uri,
  } = item;
  const to = generateContentPath(type, id);

  type OneLineItem = SpotifyAPI.Artist | SpotifyAPI.Playlist | SpotifyAPI.Show | SpotifyAPI.Episode;
  const getOneLineItem = (oneLineItem: OneLineItem) => ({
    releaseId: id,
    images: oneLineItem.images,
  });

  type CommonPropKey = 'type' | 'id' | 'name' | 'uri' | 'to';
  const info: { [k in App.ContentItemType]: () => Omit<App.ContentItemInfo<k>, CommonPropKey> } = {
    track() {
      const { album } = item as SpotifyAPI.Track;
      return {
        releaseId: album.id,
        images: album.images,
        artists: album.artists,
      };
    },
    album() {
      const album = item as SpotifyAPI.Album;
      return {
        releaseId: id,
        images: album.images,
        artists: album.artists,
      };
    },
    artist() {
      return getOneLineItem(item as SpotifyAPI.Artist);
    },
    playlist() {
      return getOneLineItem(item as SpotifyAPI.Playlist);
    },
    show() {
      return getOneLineItem(item as SpotifyAPI.Show);
    },
    episode() {
      return getOneLineItem(item as SpotifyAPI.Episode);
    },
  };

  return {
    type,
    id,
    name,
    uri,
    to,
    ...info[type](),
  };
};
