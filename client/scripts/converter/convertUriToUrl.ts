import type { SpotifyAPI } from '~~/types';

// @todo
type ContextType = 'artist' | 'playlist' | 'album' | 'track' | 'episode' | 'user'

const genUrl = (type: string, id: string) => `/${type}s/${id}`;

/**
 * @param uri spotify:track:hoge1234 のような形式
 */
export const convertUriToUrl = (uri: string | undefined): string | undefined => {
  if (uri == null) return undefined;

  const elementList = uri.split(':');
  const type = elementList[1] as SpotifyAPI.Context['type'] as ContextType;
  const id = elementList[2];

  switch (type) {
    case 'artist':
    case 'playlist':
    case 'episode':
      return genUrl(type, id);
    case 'album':
      return genUrl('release', id);
    case 'user':
      return elementList[elementList.length - 1] === 'collection'
        ? '/library/tracks'
        : undefined;
    default:
      return undefined;
  }
};
