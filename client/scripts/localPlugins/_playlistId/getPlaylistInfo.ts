import { Context } from '@nuxt/types';

import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { addComma } from '~~/utils/addComma';
import { App } from '~~/types';

export const getPlaylistInfo = async (
  { app, params }: Context,
  artworkSize: number,
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
    description,
    uri,
    images,
    tracks,
    owner,
    followers,
  } = playlistInfo;

  const artworkSrc = getImageSrc(images, artworkSize);

  const filteredTrackList = tracks.items
    .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
  const totalTracks = filteredTrackList.length;
  const durationMs = filteredTrackList.reduce((prev, { track }) => track.duration_ms + prev, 0);

  // owner が自分の場合はフォローボタンは表示しない
  const [isFollowing] = owner.id === userId
    ? [undefined]
    : await app.$spotify.following.checkUserFollowedPlaylist({
      playlistId: playlistInfo.id,
      userIdList: [userId],
    });

  const followersText = `フォロワー ${addComma(followers.total)}人`;

  return {
    id,
    name,
    description,
    uri,
    owner,
    artworkSrc,
    totalTracks,
    durationMs,
    isFollowing,
    followersText,
  };
};
