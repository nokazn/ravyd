import { App, SpotifyAPI } from '~~/types';

export const convertTrackDetail = <
  T extends SpotifyAPI.Track | SpotifyAPI.SimpleTrack = SpotifyAPI.Track
>({
    isTrackSavedList,
    offset = 0,
    releaseId,
    releaseName,
    artistIdList,
    artworkList,
  }: T extends SpotifyAPI.Track
  // Track の場合は release の情報は不要
  ? {
    isTrackSavedList: boolean[]
    offset?: number
    releaseId?: undefined
    releaseName?: undefined
    artistIdList?: string[]
    artworkList?: undefined
  }
  : {
    isTrackSavedList: boolean[]
    offset?: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    artworkList: SpotifyAPI.Image[]
  },
  ) => (
    track: T,
    index: number,
  ): App.TrackDetail => {
    // artistIdList が undefined のとき track は SpotifyAPI.Track
    const releaseArtistIdList = artistIdList
      ?? (track as SpotifyAPI.Track).album.artists.map((artist) => artist.id);

    // artistIdList に含まれるかどうかで分ける
    const artistList: App.SimpleArtistInfo[] = [];
    const featuredArtistList: App.SimpleArtistInfo[] = [];
    track.artists.forEach((artist) => {
      const info = {
        id: artist.id,
        name: artist.name,
      };
      if (releaseArtistIdList.includes(artist.id)) {
        artistList.push(info);
      } else {
        featuredArtistList.push(info);
      }
    });

    const detail = {
      index: index + offset,
      id: track.id,
      name: track.name,
      uri: track.uri,
      trackNumber: track.track_number,
      discNumber: track.disc_number,
      hash: `${track.disc_number}-${track.track_number}`,
      artistList,
      featuredArtistList,
      isPlayable: track.is_playable,
      explicit: track.explicit,
      durationMs: track.duration_ms,
      externalUrls: track.external_urls,
      previewUrl: track.preview_url,
      isSaved: isTrackSavedList[index],
      releaseId: releaseId ?? (track as SpotifyAPI.Track).album.id,
      releaseName: releaseName ?? (track as SpotifyAPI.Track).album.name,
      artworkList: artworkList ?? (track as SpotifyAPI.Track).album.images,
    };

    return detail;
  };
