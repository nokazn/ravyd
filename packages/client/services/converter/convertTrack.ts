import type { SpotifyAPI } from 'shared/types';

import { convertUriToId, convertAddedAt } from '~/services/converter';
import type { App } from '~/entities';

// TODO
type ExtendedTrack = Spotify.Track & {
  duration_ms?: number
  linked_from?: SpotifyAPI.LinkedTrack
}

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
      type: track.type,
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

export const convertTrackForQueue = ({ isSet, isPlaying, offset = 0 }: {
  isSet: boolean
  isPlaying: boolean
  offset?: number
}) => (track: ExtendedTrack | SpotifyAPI.Track, i: number): App.TrackQueue => {
  // Array#map 関数が呼べるように型を定義する
  const { artists }: { artists: (Spotify.Artist | SpotifyAPI.SimpleArtist)[]} = track;

  const info = {
    isSet,
    isPlaying,
    index: i + offset,
    type: track.type,
    id: track.id ?? undefined,
    name: track.name,
    uri: track.uri,
    releaseName: track.album.name,
    releaseId: convertUriToId(track.album.uri),
    artists: artists.map((artist) => ({
      ...artist,
      id: convertUriToId(artist.uri),
    })),
    images: track.album.images,
    durationMs: track.duration_ms,
    linkedFrom: track.linked_from,
  };

  return info;
};

export const convertPlaylistTrackDetail = (
  { isTrackSavedList, offset = 0 }: {
    isTrackSavedList: boolean[],
    offset?: number
  },
) => (
  { track, added_at, added_by }: {
    track: SpotifyAPI.Track;
    added_at: string;
    added_by?: SpotifyAPI.User;
  },
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
    artists: track.artists,
    featuredArtists: [],
    explicit: track.explicit,
    isPlayable: track.is_playable,
    durationMs: track.duration_ms,
    externalIds: track.external_ids,
    externalUrls: track.external_urls,
    previewUrl: track.preview_url,
    isSaved: isTrackSavedList[index],
    releaseId: track.album.id,
    releaseName: track.album.name,
    images: track.album.images,
    linkedFrom: track.linked_from,
    addedAt: convertAddedAt(added_at),
    addedBy: added_by,
  };

  return detail;
};

export const convertTrackForCard = (track: SpotifyAPI.Track): App.ReleaseCard<'track'> => {
  return {
    type: track.type,
    releaseId: track.album.id,
    id: track.id,
    name: track.name,
    uri: track.uri,
    artists: track.artists,
    images: track.album.images,
    externalUrls: track.external_urls,
    linkedFrom: track.linked_from,
  };
};

