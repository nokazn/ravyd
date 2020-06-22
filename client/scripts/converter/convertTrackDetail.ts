import { App, SpotifyAPI } from '~~/types';
import { getImageSrc } from './getImageSrc';

export const convertTrackDetail = <
  T extends SpotifyAPI.Track | SpotifyAPI.SimpleTrack = SpotifyAPI.Track
>({
    isTrackSavedList,
    artworkSize,
    offset = 0,
    releaseId,
    releaseName,
    artistIdList,
    artworkSrc,
  }: T extends SpotifyAPI.Track
  ? {
    isTrackSavedList: boolean[]
    artworkSize?: number
    offset?: number
    releaseId?: undefined
    releaseName?: undefined
    artistIdList?: undefined
    artworkSrc?: undefined
  }
  : {
    isTrackSavedList: boolean[]
    artworkSize?: number
    offset?: number
    releaseId: string
    releaseName: string
    artistIdList: string[]
    artworkSrc: string | undefined
  },
  ) => (
    track: T,
    index: number,
  ): App.TrackDetail => {
    // artistIdList が undefined のとき track は SpotifyAPI.Track
    const releaseArtistIdList = artistIdList
      ?? (track as SpotifyAPI.Track).album.artists.map((artist) => artist.id);
    const artistList = track.artists
      .filter((artist) => !releaseArtistIdList.includes(artist.id))
      .map((artist) => ({
        id: artist.id,
        name: artist.name,
      }));

    const detail = {
      index: index + offset,
      name: track.name,
      id: track.id,
      uri: track.uri,
      trackNumber: track.track_number,
      discNumber: track.disc_number,
      hash: `${track.disc_number}-${track.track_number}`,
      artistList,
      explicit: track.explicit,
      isPlayable: track.is_playable,
      durationMs: track.duration_ms,
      externalUrls: track.external_urls,
      previewUrl: track.preview_url,
      isSaved: isTrackSavedList[index],
      releaseId: releaseId ?? (track as SpotifyAPI.Track).album.id,
      releaseName: releaseName ?? (track as SpotifyAPI.Track).album.name,
      artworkSrc: artworkSrc ?? getImageSrc((track as SpotifyAPI.Track).album.images, artworkSize),
    };

    return detail;
  };
