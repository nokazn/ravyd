import { Context } from '@nuxt/types';

import { getFollowersText } from '~/scripts/converter/getFollowersText';
import { App } from '~~/types';

export const getPlaylistInfo = async (
  { app, params }: Context,
): Promise<App.PlaylistInfo | undefined> => {
  const { playlistId } = params;
  const market = app.$getters()['auth/userCountryCode'];
  const userId = app.$getters()['auth/userId'];
  if (market == null || userId == null) return undefined;

  const playlistInfo = await app.$spotify.playlists.getPlaylist({
    playlistId,
    market,
  });
  if (playlistInfo == null) return undefined;

  const {
    id,
    name,
    uri,
    description,
    collaborative: isCollaborative,
    images,
    tracks,
    owner,
    followers,
    public: isPublic,
    external_urls: externalUrls,
  } = playlistInfo;

  const filteredTrackList = tracks.items
    .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
  const totalTracks = filteredTrackList.length;
  const durationMs = filteredTrackList.reduce((prev, { track }) => track.duration_ms + prev, 0);
  const trackUriList = filteredTrackList.map(({ track }) => track.uri);

  const isOwnPlaylist = owner.id === userId;

  return {
    id,
    name,
    uri,
    description,
    isCollaborative,
    owner,
    images,
    totalTracks,
    durationMs,
    isPublic,
    isOwnPlaylist,
    followersText: getFollowersText(followers.total),
    externalUrls,
    trackUriList,
  };
};
