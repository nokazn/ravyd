import { Context } from '@nuxt/types';
import { parseAlbumType } from '~/scripts/parser/parseAlbumType';
import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { parseTrackDetail } from '~/scripts/parser/parseTrackDetail';
import { App } from '~~/types';

export const getReleaseInfo = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.ReleaseInfo | null> => {
  const release = await app.$spotify.albums.getAlbum({ albumId: params.releaseId });
  if (release == null) return null;

  const {
    album_type,
    artists,
    label,
    name,
    id,
    uri,
    release_date: releaseDate,
    release_date_precision: releaseDatePrecision,
    tracks,
    total_tracks: totalTracks,
    images,
    copyrights: copyrightList,
  } = release;

  const albumType = parseAlbumType(album_type);

  const artistList = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
  }));

  const artworkSrc = getImageSrc(images, artworkSize);

  const trackIdList = tracks.items.map((track) => track.id);
  const albumIdList = [id];
  const [isTrackSavedList, [isSaved]] = await Promise.all([
    // @todo 50 トラック超えた時
    app.$spotify.library.checkUserSavedTracks({ trackIdList }),
    app.$spotify.library.checkUserSavedAlbums({ albumIdList }),
  ] as const);

  const trackList = tracks.items.map(parseTrackDetail(isTrackSavedList));

  const durationMs = tracks.items.reduce((prev, track) => track.duration_ms + prev, 0);

  return {
    albumType,
    artistList,
    label,
    name,
    id,
    uri,
    releaseDate,
    releaseDatePrecision,
    artworkSrc,
    trackList,
    totalTracks,
    durationMs,
    copyrightList,
    isSaved,
  };
};
