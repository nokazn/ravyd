import { Context } from '@nuxt/types';
import { convertReleaseType } from '~/scripts/converter/convertReleaseType';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';
import { App, SpotifyAPI, OneToFifty } from '~~/types';

export const getReleaseInfo = async (
  { app, params }: Context,
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

  const releaseType = convertReleaseType(album_type, totalTracks);

  const LIMIT_OF_RELEASES = 10;

  /**
   * アーティストの他のリリースを取得
   */
  const getArtistReleaseList = (
    limit: number = LIMIT_OF_RELEASES,
  ): Promise<App.ReleaseInfo['artistReleaseList']> => Promise.all(artists.map(async (artist) => {
    const releases = await app.$spotify.artists.getArtistAlbums({
      artistId: artist.id,
      country: market,
      // 同じリリースが含まれる場合は除いて limit 件にするため
      limit: limit + 1 as OneToFifty,
    });
    // 同じリリースを除いて limit 件にする
    const items = releases?.items
      .map(convertReleaseForCard)
      .filter((item) => item.id !== params.releaseId)
      .slice(0, limit) ?? [];

    return {
      ...artist,
      items,
    };
  }));

  const trackIdList = tracks.items.map((track) => track.id);
  const [
    [isSaved],
    isTrackSavedList,
    artistReleaseList,
  ] = await Promise.all([
    app.$spotify.library.checkUserSavedAlbums({ albumIdList: [id] }),
    app.$spotify.library.checkUserSavedTracks({ trackIdList }),
    getArtistReleaseList(),
  ] as const);

  const trackList: App.TrackDetail[] = tracks.items.map((track, index) => {
    const detail = convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      releaseId: id,
      releaseName: name,
      artistIdList: artists.map((artist) => artist.id),
      images,
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
    artistList: artists,
    releaseDate,
    releaseDatePrecision,
    images,
    totalTracks,
    durationMs,
    label,
    copyrightList,
    isSaved,
    trackList,
    externalUrls,
    genreList,
    isFullTrackList,
    artistReleaseList,
  };
};
