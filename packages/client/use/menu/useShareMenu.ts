import type { SpotifyAPI } from 'shared/types';
import ShareMenu from '~/components/parts/menu/ShareMenu.vue';
import type { App } from '~/entities';

export type ShareMenuProps = {
  name: string;
  uri: string;
  url?: string;
  typeName: string;
  artists: App.MinimumArtist[] | string | undefined;
  externalUrls: SpotifyAPI.ExternalUrls;
  left?: boolean;
  right?: boolean;
}

export const useShareMenu = (
  options: {
    name: string;
    uri: string;
    url?: string;
    typeName: string;
    artists: App.MinimumArtist[] | string | undefined;
    externalUrls: SpotifyAPI.ExternalUrls;
    left?: boolean;
    right?: boolean;
  } | undefined,
): App.MenuItem<'custom' | 'component', ShareMenuProps> => {
  if (options == null) {
    return {
      type: 'custom',
      name: 'シェア',
      handler: () => {},
      disabled: true,
    };
  }

  return {
    type: 'component',
    component: ShareMenu,
    props: {
      name: options.name,
      uri: options.uri,
      typeName: options.typeName,
      artists: options.artists,
      externalUrls: options.externalUrls,
      left: options.left ?? false,
      right: options.right ?? true,
    },
  };
};
