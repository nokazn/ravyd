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
  trackOrEpisode: App.TrackDetail | App.EpisodeDetail | undefined,
  options?: {
    left: boolean;
    right: boolean;
  },
): App.MenuItem<'custom' | 'component', AddItemToPlaylistMenuProps> => {
  if (trackOrEpisode == null) {
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
      name: trackOrEpisode.name,
      uriList: [trackOrEpisode.uri],
      artists: 'artists' in trackOrEpisode
        ? trackOrEpisode.artists
        : undefined,
      left: options?.left ?? false,
      right: options?.right ?? true,
    },
  };
};
