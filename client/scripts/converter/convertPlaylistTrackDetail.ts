import { convertAddedAt } from '~/scripts/converter/convertAddedAt';
import { App, SpotifyAPI } from '~~/types';

export const convertPlaylistTrackDetail = (
  { isTrackSavedList, offset = 0 }: {
    isTrackSavedList: boolean[],
    offset?: number
  },
) => (
  { track, added_at, added_by }: SpotifyAPI.PlaylistTrack & { track: SpotifyAPI.Track },
  index: number,
): App.PlaylistTrackDetail => {
  const detail = {
    type: track.type,
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
    featuredArtistList: [],
    explicit: track.explicit,
    isPlayable: track.is_playable,
    durationMs: track.duration_ms,
    externalIds: track.external_ids,
    externalUrls: track.external_urls,
    previewUrl: track.preview_url,
    isSaved: isTrackSavedList[index],
    releaseId: track.album.id,
    releaseName: track.album.name,
    artworkList: track.album.images,
    addedAt: convertAddedAt(added_at),
    addedBy: added_by,
  };

  return detail;
};
