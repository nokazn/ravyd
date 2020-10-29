import { Context } from '@nuxt/types';
import { convertReleaseType, convertTrackDetail, convertReleaseForCard } from '~/services/converter';
import { App, SpotifyAPI, OneToFifty } from '~~/types';

export const getRelease = async (
  { app, params }: Context,
): Promise<App.ReleasePage | undefined> => {
  // アーティストの他のリリースを取得
  const getArtistReleaseList = (
    artistList: SpotifyAPI.SimpleArtist[],
    { market, limit = 10 }: {
      market?: SpotifyAPI.Country
      limit?: OneToFifty
    },
  ): Promise<App.ReleasePage['artistReleaseList']> => Promise.all(artistList.map(async (artist) => {
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
    artists: simpleArtists,
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

  const trackIdList = tracks.items.map((track) => track.id);
  const artistIdList = simpleArtists.map((artist) => artist.id);
  const [
    [isSaved],
    isTrackSavedList,
    artists,
    artistReleaseList,
  ] = await Promise.all([
    app.$spotify.library.checkUserSavedAlbums({ albumIdList: [id] }),
    app.$spotify.library.checkUserSavedTracks({ trackIdList }),
    app.$spotify.artists.getArtists({ artistIdList }),
    getArtistReleaseList(simpleArtists, { market }),
  ] as const);

  const trackList: App.TrackDetail[] = tracks.items.map((track, index) => {
    return convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      releaseId: id,
      releaseName: name,
      artistIdList,
      images,
    })(track, index);
  });

  const filteredArtists = artists.filter((artist) => artist != null) as SpotifyAPI.Artist[];
  const releaseType = convertReleaseType(album_type, totalTracks);
  const durationMs = tracks.items.reduce((prev, curr) => prev + curr.duration_ms, 0);
  const hasNextTrack = tracks.next != null;
  const hasPreviousTrack = tracks.previous != null;

  return {
    releaseType,
    id,
    name,
    uri,
    artists: filteredArtists,
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
    hasNextTrack,
    hasPreviousTrack,
    artistReleaseList,
  };
};
