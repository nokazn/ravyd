import type { SpotifyAPI } from 'shared/types';

import { convertUriToId, convertAddedAt } from '~/services/converter';
import type { App } from '~/entities';

// TODO
interface ExtendedTrack extends Spotify.Track {
  duration_ms?: number
  linked_from?: SpotifyAPI.LinkedTrack
}

type Track = SpotifyAPI.Track | SpotifyAPI.SimpleTrack;
type CommonConvertTrackDetailParams = {
  isTrackSavedList: boolean[];
  artistIdList?: string[];
  offset?: number;
};
// Track の場合は release の情報は不要
type ConvertTrackDetailParams<T extends Track> = T extends SpotifyAPI.Track
  ? CommonConvertTrackDetailParams
  : CommonConvertTrackDetailParams & {
    releaseId: string;
    releaseName: string;
    artistIdList: string[];
    images: SpotifyAPI.Image[];
  };
type ArtistsMap = Record<'artists' | 'featuredArtists', SpotifyAPI.SimpleArtist[]>;

const hasReleaseAttributes = (
  params: ConvertTrackDetailParams<Track>,
): params is ConvertTrackDetailParams<SpotifyAPI.SimpleTrack> => {
  return 'releaseId' in params;
};

export const convertTrackDetail = <T extends Track = SpotifyAPI.Track>(params: ConvertTrackDetailParams<T>) => (
  track: T,
  index: number,
): App.TrackDetail => {
  // TODO: artistIdList が undefined のとき track は SpotifyAPI.Track
  const releaseArtistIdList = params.artistIdList ?? (track as SpotifyAPI.Track)
    .album.artists.map((artist) => artist.id);
  const artistsMap = Object.freeze(track.artists.reduce((prev, curr) => {
    // artistIdList に含まれるかどうかで分ける
    return releaseArtistIdList.includes(curr.id)
      ? Object.assign(prev, { artists: [...prev.artists, curr] })
      : Object.assign(prev, { featuredArtists: [...prev.featuredArtists, curr] });
  }, {
    artists: [],
    featuredArtists: [],
  } as ArtistsMap));
  const common = {
    type: track.type,
    index: index + (params.offset ?? 0),
    id: track.id,
    name: track.name,
    uri: track.uri,
    trackNumber: track.track_number,
    discNumber: track.disc_number,
    artists: artistsMap.artists,
    featuredArtists: artistsMap.featuredArtists,
    isPlayable: track.is_playable,
    explicit: track.explicit,
    durationMs: track.duration_ms,
    externalUrls: track.external_urls,
    previewUrl: track.preview_url,
    isSaved: params.isTrackSavedList[index],
    linkedFrom: track.linked_from,
  };

  if (hasReleaseAttributes(params)) {
    return {
      ...common,
      releaseId: params.releaseId,
      releaseName: params.releaseName,
      images: params.images,
    };
  }
  const { album } = track as SpotifyAPI.Track;
  return {
    ...common,
    releaseId: album.id,
    releaseName: album.name,
    images: album.images,
  };
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

interface ConvertPlaylistTrackDetailParams1 {
  isTrackSavedList: boolean[];
  offset?: number;
}
interface ConvertPlaylistTrackDetailParams2 {
  track: SpotifyAPI.Track;
  added_at: string;
  added_by?: SpotifyAPI.User;
}

export const convertPlaylistTrackDetail = (
  { isTrackSavedList, offset = 0 }: ConvertPlaylistTrackDetailParams1,
) => (
  { track, added_at, added_by }: ConvertPlaylistTrackDetailParams2,
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

