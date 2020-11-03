import type { SetupContext } from '@vue/composition-api';
import ArtistLinkMenu from '~/components/parts/menu/ArtistLinkMenu.vue';
import { App } from '~~/types';

export type Props = {
  artists: App.MinimumArtist[];
  left?: boolean;
  right?: boolean;
}

export const useArtistPage = (
  root: SetupContext['root'],
  track: App.TrackDetail,
): App.MenuItem<App.MenuType, Props> => {
  const artists = [...track.artists, ...track.featuredArtists];
  const { length } = artists;
  const name = 'アーティストページに移動';
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
    const props: Props = {
      artists,
      left: true,
    };
    return {
      type: 'component',
      component: ArtistLinkMenu,
      props,
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
