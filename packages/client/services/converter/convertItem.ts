import type { ValueOf } from 'shared/types';
import { generateContentPath } from '~/services/converter';
import type { App } from '~/entities';

type CommonKey = 'type' | 'id' | 'name' | 'uri' | 'externalUrls';
type SpecifiedItemParams = Omit<App.ContentItem, CommonKey>;

const itemIdentifier = <T extends App.ContentItemType>(
  item: ValueOf<App.ContentItemTypes>,
  type: T,
): item is App.ContentItemTypes[T] => {
  return item.type === type;
};

const getSpecifiedParams = (item: ValueOf<App.ContentItemTypes>): SpecifiedItemParams => {
  if (itemIdentifier(item, 'track')) {
    return {
      releaseId: item.album.id,
      images: item.album.images,
      artists: item.album.artists,
      to: generateContentPath('track', item.album.id, item.id),
      linkedFrom: item.linked_from,
    };
  }
  if (itemIdentifier(item, 'album')) {
    return {
      releaseId: item.id,
      images: item.images,
      artists: item.artists,
      to: generateContentPath('album', item.id),
    };
  }
  return {
    releaseId: item.id,
    images: item.images,
    to: generateContentPath(item.type, item.id),
  };
};

export const convertToContentListItem = <T extends App.ContentItemType>(type: T) => (
  item: App.ContentItemTypes[T],
): App.ContentItem<T> => {
  return {
    type,
    id: item.id,
    name: item.name,
    uri: item.uri,
    externalUrls: item.external_urls,
    ...getSpecifiedParams(item),
  };
};
