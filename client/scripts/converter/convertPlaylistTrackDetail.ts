import { elapsedTime } from '~~/utils/elapsedTime';
import { convertAddedAt } from '~/scripts/converter/convertAddedAt';
import { App, SpotifyAPI } from '~~/types';

export const convertPlaylistTrackDetail = (
  {
    isTrackSavedList,
    offset = 0,
  }: {
    isTrackSavedList: boolean[],
    offset?: number
  },
) => (
  { track, added_at }: { track: SpotifyAPI.Track, added_at: string },
  index: number,
): App.PlaylistTrackDetail => {
  const detail = {
    index: index + offset,
    name: track.name,
    id: track.id,
    uri: track.uri,
    trackNumber: track.track_number,
    discNumber: track.disc_number,
    hash: `${track.disc_number}-${track.track_number}`,
    artistList: track.artists.map((artist) => ({
      name: artist.name,
      id: artist.id,
    })),
    explicit: track.explicit,
    isPlayable: track.is_playable,
    duration: elapsedTime(track.duration_ms),
    externalIds: track.external_ids,
    externalUrls: track.external_urls,
    previewUrl: track.preview_url,
    isSaved: isTrackSavedList[index],
    releaseId: track.album.id,
    releaseName: track.album.name,
    artworkList: track.album.images,
    addedAt: convertAddedAt(added_at),
  };

  return detail;
};
