import { Context } from '@nuxt/types';

import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { addComma } from '~~/utils/addComma';
import { App } from '~~/types';

export const getPlaylistInfo = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.PlaylistInfo | null> => {
  const { playlistId } = params;
  const market = app.$getters()['auth/userCountryCode'];
  const userId = app.$state().auth.userData?.id;
  if (market == null || userId == null) return null;

  const playlistInfo = await app.$spotify.playlists.getPlaylist({
    playlistId,
    market,
  });
  if (playlistInfo == null) return null;

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

  const durationMs = tracks.items.reduce((prev, { track }) => track.duration_ms + prev, 0);

  tracks.items.reduce((prev, { track }) => {
    console.log({ prev, curr: track });
    return track.duration_ms + prev;
  }, 0);

  const totalTracks = tracks.items.length;

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
    artworkSrc,
    owner,
    totalTracks,
    durationMs,
    isFollowing,
    followersText,
  };
};
