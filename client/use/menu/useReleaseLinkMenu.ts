import { SetupContext } from '@vue/composition-api';
import type { App } from '~/entities';

export const useReleaseLinkMenu = (
  root: SetupContext['root'],
  item: App.SimpleTrackDetail | App.EpisodeDetail | undefined,
): App.MenuItem<'custom' | 'to'> => {
  if (item == null) {
    return {
      type: 'custom',
      name: 'アルバムのページに移動',
      handler: () => {},
      disabled: true,
    };
  }

  if ('showId' in item) {
    return {
      type: 'to',
      name: 'ポッドキャストのページに移動',
      to: `/shows/${item.showId}`,
      disabled: root.$route.params.showId === item.showId,
    };
  }
  // App.SimpleTrackDetail で episode の場合も考慮
  if (item.type === 'episode') {
    return {
      type: 'to',
      name: 'ポッドキャストのページに移動',
      to: `/shows/${item.releaseId}`,
      disabled: root.$route.params.showId === item.releaseId,
    };
  }

  return {
    type: 'to',
    name: 'アルバムのページに移動',
    to: `/releases/${item.releaseId}`,
    disabled: root.$route.params.releaseId === item.releaseId || item.type !== 'track',
  };
};
