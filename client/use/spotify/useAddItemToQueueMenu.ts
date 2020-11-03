import { SetupContext } from '@vue/composition-api';
import { App } from '~~/types';

export const useAddItemToQueueMenu = (
  root: SetupContext['root'],
  trackOrEpisode: App.TrackDetail | App.EpisodeDetail,
): App.MenuItem<'custom'> => {
  const trackName = trackOrEpisode.name;
  return {
    type: 'custom',
    name: '次に再生に追加',
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
