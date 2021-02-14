import type { SetupContext } from '@vue/composition-api';
import type { App } from '~/entities';

export const useTrackLinkMenu = (
  root: SetupContext['root'],
  item: App.SimpleTrackDetail | App.EpisodeDetail | undefined,
): App.MenuItem<'custom' | 'to'> => {
  if (item == null) {
    return {
      type: 'custom',
      name: '曲のページに移動',
      handler: () => {},
      disabled: true,
    };
  }

  // App.SimpleTrackDetail で episode の場合も考慮
  if ('showId' in item || item.type === 'episode') {
    return {
      type: 'to',
      name: 'エピソードのページに移動',
      to: `/episodes/${item.id}`,
      disabled: root.$route.params.episodeId === item.id,
    };
  }

  return {
    type: 'to',
    name: '曲のページに移動',
    to: {
      path: `/releases/${item.releaseId}`,
      query: { track: item.id },
    },
    disabled: root.$route.params.releaseId === item.releaseId || item.type !== 'track',
  };
};
