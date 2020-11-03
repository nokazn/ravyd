import { SetupContext } from '@vue/composition-api';
import { App } from '~~/types';

export const useTrackLinkMenu = (
  root: SetupContext['root'],
  item: App.SimpleTrackDetail | undefined,
): App.MenuItem<'custom' | 'to'> => {
  const isEpisode = item?.type === 'episode';
  const name = isEpisode
    ? 'エピソードのページに移動'
    : '曲のページに移動';
  if (item == null) {
    return {
      type: 'custom',
      name,
      handler: () => {},
      disabled: true,
    };
  }

  const { id, releaseId } = item;
  return {
    type: 'to',
    name,
    to: isEpisode
      ? `/episodes/${id}`
      : {
        path: `/releases/${releaseId}`,
        query: { track: id },
      },
    disabled: isEpisode
      ? root.$route.params.episodeId === id
      : root.$route.params.releaseId === releaseId,
  };
};
