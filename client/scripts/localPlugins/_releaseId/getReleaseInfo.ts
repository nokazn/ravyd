import { Context } from '@nuxt/types';
import { convertReleaseType } from '~/scripts/converter/convertReleaseType';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { App, SpotifyAPI } from '~~/types';
import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';

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
    images: artworkList,
    tracks,
    copyrights: copyrightList,
    external_urls: externalUrls,
    genres: genreList,
  } = release;

  const releaseType = convertReleaseType(album_type, totalTracks);

  const artistList = artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
  }));

  const limit = 10;
  const artistReleaseList = await Promise.all(artistList.map(async (artist) => {
    const releases = await app.$spotify.artists.getArtistAlbums({
      artistId: artist.id,
      country: market,
      // 同じリリースが含まれる場合は除いて 10 件にするため
      limit: limit + 1,
    });
    // 同じリリースを除いて 10 件にする
    const items = releases?.items
      .map(convertReleaseForCard(artworkSize))
      .filter((item) => item.id !== params.releaseId)
      .slice(0, limit) ?? [];

    return {
      ...artist,
      items,
    };
  }));

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
      artistIdList: artistList.map((artist) => artist.id),
      artworkList,
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
    artworkList,
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
