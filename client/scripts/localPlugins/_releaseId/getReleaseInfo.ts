import { Context } from '@nuxt/types';
import { convertAlbumType } from '~/scripts/converter/convertAlbumType';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App } from '~~/types';

export const getReleaseInfo = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.ReleaseInfo | null> => {
  const market = app.$getters()['auth/userCountryCode'];
  const release = await app.$spotify.albums.getAlbum({
    albumId: params.releaseId,
    market,
  });
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

  const albumType = convertAlbumType(album_type);

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

  const trackList = tracks.items.map(convertTrackDetail({ isTrackSavedList }));

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
