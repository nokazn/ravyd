import type { Context } from '@nuxt/types';
import type { App } from '~/entities';

export const getPlaylist = async (
  { app, params }: Context,
): Promise<App.PlaylistPage | undefined> => {
  const { playlistId } = params;
  const userId = app.$getters()['auth/userId'];
  if (userId == null) return undefined;

  const playlist = await app.$spotify.playlists.getPlaylist({ playlistId });
  if (playlist == null) return undefined;

  const {
    id,
    name,
    uri,
    description,
    collaborative: isCollaborative,
    images,
    tracks,
    owner: simpleOwner,
    followers,
    public: isPublic,
    external_urls: externalUrls,
  } = playlist;

  const filteredTrackList = tracks.items
    .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
  const totalTracks = filteredTrackList.length;
  const durationMs = filteredTrackList.reduce((prev, { track }) => track.duration_ms + prev, 0);
  const trackUriList = filteredTrackList.map(({ track }) => track.uri);

  // simpleOwner には images が含まれていないので別途取得
  const owner = await app.$spotify.users.getUserProfile({ userId: simpleOwner.id });
  const isOwnPlaylist = simpleOwner.id === userId;

  return {
    id,
    name,
    uri,
    description,
    isCollaborative,
    owner: owner ?? simpleOwner,
    images,
    totalTracks,
    durationMs,
    isPublic,
    isOwnPlaylist,
    followers,
    externalUrls,
    trackUriList,
  };
};
