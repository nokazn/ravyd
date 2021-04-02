import type { SetupContext } from '@vue/composition-api';
import type { App } from '~/entities';
import ArtistLinkMenu from '~/components/parts/menu/ArtistLinkMenu.vue';

export type ArtistLinkMenuProps = {
  artists: App.MinimumArtist[];
  left?: boolean;
  right?: boolean;
};

export const useArtistLinkMenu = (
  root: SetupContext['root'],
  trackOrRelease: App.SimpleTrackDetail | App.TrackDetail | App.ReleasePage | undefined,
  options?: {
    left?: boolean;
    right: boolean;
  },
): App.MenuItem<App.MenuType, ArtistLinkMenuProps> => {
  const name = 'アーティストページに移動';
  if (trackOrRelease == null) {
    return {
      type: 'custom',
      name,
      handler: () => {},
      disabled: true,
    };
  }

  const artists = 'featuredArtists' in trackOrRelease
    ? [...trackOrRelease.artists, ...trackOrRelease.featuredArtists]
    : trackOrRelease.artists;
  const { length } = artists;

  if (length === 0) {
    return {
      type: 'custom',
      name,
      handler: () => {},
      disabled: true,
    };
  }
  //  アーティストが複数の時
  if (artists.length > 1) {
    return {
      type: 'component',
      component: ArtistLinkMenu,
      props: {
        artists,
        left: options?.left ?? false,
        right: options?.right ?? true,
      },
    };
  }
  // アーティストが一組の時
  const artistId = artists[0].id;
  return {
    type: 'to',
    name,
    to: `/artists/${artistId}`,
    disabled: root.$route.params.artistId === artistId,
  };
};
