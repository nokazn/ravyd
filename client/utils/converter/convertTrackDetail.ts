import { App, SpotifyAPI } from '~~/types';

export const convertTrackDetail = <
  T extends SpotifyAPI.Track | SpotifyAPI.SimpleTrack = SpotifyAPI.Track
>({
    isTrackSavedList,
    offset = 0,
    releaseId,
    releaseName,
    artistIdList,
    images,
  }: T extends SpotifyAPI.Track
  // Track の場合は release の情報は不要
  ? {
    isTrackSavedList: boolean[]
    offset?: number
    releaseId?: undefined
    releaseName?: undefined
    artistIdList?: string[]
    images?: undefined
  }
  : {
    isTrackSavedList: boolean[]
    offset?: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    images: SpotifyAPI.Image[]
  },
  ) => (
    track: T,
    index: number,
  ): App.TrackDetail => {
    // artistIdList が undefined のとき track は SpotifyAPI.Track
    const releaseArtistIdList = artistIdList
      ?? (track as SpotifyAPI.Track).album.artists.map((artist) => artist.id);

    // artistIdList に含まれるかどうかで分ける
    const artists: SpotifyAPI.SimpleArtist[] = [];
    const featuredArtists: SpotifyAPI.SimpleArtist[] = [];
    track.artists.forEach((artist) => {
      if (releaseArtistIdList.includes(artist.id)) {
        artists.push(artist);
      } else {
        featuredArtists.push(artist);
      }
    });

    const detail = {
      index: index + offset,
      id: track.id,
      name: track.name,
      uri: track.uri,
      trackNumber: track.track_number,
      discNumber: track.disc_number,
      artists,
      featuredArtists,
      isPlayable: track.is_playable,
      explicit: track.explicit,
      durationMs: track.duration_ms,
      externalUrls: track.external_urls,
      previewUrl: track.preview_url,
      isSaved: isTrackSavedList[index],
      releaseId: releaseId ?? (track as SpotifyAPI.Track).album.id,
      releaseName: releaseName ?? (track as SpotifyAPI.Track).album.name,
      images: images ?? (track as SpotifyAPI.Track).album.images,
      linkedFrom: track.linked_from,
    };

    return detail;
  };
