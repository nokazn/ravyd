import { Context } from '@nuxt/types';
import { convertReleaseType } from '~/scripts/converter/convertReleaseType';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App, SpotifyAPI } from '~~/types';

export const getReleaseInfo = async (
  { app, params }: Context,
  artworkSize: number,
): Promise<App.ReleaseInfo | undefined> => {
  const market = app.$getters()['auth/userCountryCode'];
  const release = await app.$spotify.albums.getAlbum({
    albumId: params.releaseId,
    market,
  });
  if (release == null) return undefined;

  const {
    album_type,
    id,
    name,
    uri,
    artists,
    release_date: releaseDate,
    release_date_precision: releaseDatePrecision,
    total_tracks: totalTracks,
    label,
    images,
    tracks,
    copyrights: copyrightList,
    external_urls: externalUrls,
    genres: genreList,

  } = release;

  const releaseType = convertReleaseType(album_type);

  const artistList = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
  }));

  const artworkSrc = getImageSrc(images, artworkSize);

  const trackIdList = tracks.items.map((track) => track.id);
  const [[isSaved], isTrackSavedList] = await Promise.all([
    app.$spotify.library.checkUserSavedAlbums({ albumIdList: [id] }),
    app.$spotify.library.checkUserSavedTracks({ trackIdList }),
  ]);

  const trackList: App.TrackDetail[] = tracks.items.map((track, index) => {
    const detail = convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      releaseId: id,
      releaseName: name,
      artworkSrc,
      artistIdList: artistList.map((artist) => artist.id),
    })(track, index);

    return detail;
  });

  const isFullTrackList = tracks.next == null;

  const durationMs = tracks.items.reduce((prev, curr) => prev + curr.duration_ms, 0);

  return {
    releaseType,
    id,
    name,
    uri,
    artistList,
    releaseDate,
    releaseDatePrecision,
    artworkSrc,
    totalTracks,
    durationMs,
    label,
    copyrightList,
    isSaved,
    trackList,
    externalUrls,
    genreList,
    isFullTrackList,
  };
};
