// TODO:
type ContextType = 'artist' | 'playlist' | 'album' | 'track' | 'episode' | 'user';

const genUrl = (type: string, id: string) => `/${type}s/${id}`;
// 最後が collection か history で終わるとき
const getUserContextUrl = (last: string) => {
  if (last === 'collection') return '/library/tracks';
  if (last === 'history') return '/library/history';
  return undefined;
};

/**
 * @param uri spotify:album:foo のような形式
 */
export const convertUriToUrl = (uri: string | undefined): string | undefined => {
  if (uri == null) return undefined;
  const elements = uri.split(':');
  if (elements[0] !== 'spotify') return undefined;
  const type = elements[1] as ContextType | undefined;
  const id = elements[2];
  switch (type) {
    case 'artist':
    case 'playlist':
    case 'episode':
      return genUrl(type, id);
    case 'album':
      return genUrl('release', id);
    case 'user':
      return getUserContextUrl(elements[elements.length - 1]);
    default:
      return undefined;
  }
};

/**
 * @param uri spotify:track:foo のような形式
 */
export const convertUriToId = (uri: string): string => {
  const elementList = uri.split(':');
  return elementList[elementList.length - 1];
};
