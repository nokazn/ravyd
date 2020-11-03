import AddItemToPlaylistMenu from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import type { App } from '~~/types';

export type AddItemToPlaylistMenuProps = {
  name: string;
  uriList: string[];
  artists: App.MinimumArtist[] | string | undefined;
  left?: boolean;
  right?: boolean;
}

export const useAddItemToPlaylistMenu = (
  item: App.SimpleTrackDetail | App.EpisodeDetail | App.ReleasePage | undefined,
  options: {
    publisher: string | undefined;
    left: boolean;
    right: boolean;
  },
): App.MenuItem<'custom' | 'component', AddItemToPlaylistMenuProps> => {
  if (item == null) {
    return {
      type: 'custom',
      name: 'プレイリストに追加',
      handler: () => {},
      disabled: true,
    };
  }

  return {
    type: 'component',
    component: AddItemToPlaylistMenu,
    props: {
      name: item.name,
      uriList: 'trackList' in item
        ? item.trackList.map((track) => track.uri)
        : [item.uri],
      artists: options?.publisher ?? ('artists' in item
        ? item.artists
        : undefined),
      left: options?.left ?? false,
      right: options?.right ?? true,
    },
  };
};
