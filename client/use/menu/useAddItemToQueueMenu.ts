import { SetupContext } from '@vue/composition-api';
import { App } from '~~/types';

export const useAddItemToQueueMenu = (
  root: SetupContext['root'],
  trackOrEpisode: App.SimpleTrackDetail | App.EpisodeDetail | undefined,
): App.MenuItem<'custom'> => {
  const type = 'custom';
  const name = '次に再生に追加';
  if (trackOrEpisode == null) {
    return {
      type,
      name,
      handler: () => {},
      disabled: true,
    };
  }

  const trackName = trackOrEpisode.name;
  return {
    type,
    name,
    handler: () => {
      root.$spotify.player.addItemToQueue({
        uri: trackOrEpisode.uri,
        deviceId: root.$getters()['playback/playbackDeviceId'],
      }).then(() => {
        root.$toast.pushPrimary(`"${trackName}" を次に再生に追加しました。`);
      }).catch((err: Error) => {
        console.error({ err });
        root.$toast.pushError(`"${trackName}" を次に再生に追加できませんでした。`);
      });
    },
  };
};
