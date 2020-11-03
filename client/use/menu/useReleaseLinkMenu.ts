import { SetupContext } from '@vue/composition-api';
import { App } from '~~/types';

export const useReleaseLinkMenu = (
  root: SetupContext['root'],
  trackOrEpisode: App.SimpleTrackDetail | undefined,
): App.MenuItem<'custom' | 'to'> => {
  const name = 'アルバムページに移動';
  if (trackOrEpisode == null) {
    return {
      type: 'custom',
      name,
      handler: () => {},
      disabled: true,
    };
  }

  const { releaseId } = trackOrEpisode;
  return {
    type: 'to',
    name,
    to: `/releases/${releaseId}`,
    disabled: root.$route.params.releaseId === releaseId,
  };
};
