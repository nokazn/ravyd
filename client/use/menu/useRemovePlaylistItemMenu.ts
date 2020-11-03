import type { SetupContext } from '@vue/composition-api';
import type { App } from '~~/types';

export const useRemovePlaylistItemMenu = (
  root: SetupContext['root'],
  trackOrEpisode: App.TrackDetail | App.EpisodeDetail,
  playlistId: string | undefined,
): App.MenuItem<'custom'> => {
  return {
    type: 'custom',
    name: 'このプレイリストから削除',
    handler: () => {
      if (playlistId == null) return;
      root.$confirm.open({
        color: 'error',
        text: '削除',
        description: `"${trackOrEpisode.name}" をプレイリストから削除しますか？`,
        onConfirm: async () => {
          await root.$dispatch('playlists/removePlaylistItem', {
            playlistId,
            track: {
              uri: trackOrEpisode.uri,
              positions: [trackOrEpisode.index],
            },
            name: trackOrEpisode.name,
          });
        },
      });
    },
    disabled: playlistId == null,
  };
};
