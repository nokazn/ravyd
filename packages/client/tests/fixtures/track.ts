import type { OneToHundred, SpotifyAPI } from 'shared/types';
import { simpleArtist } from './artist';
import { simpleAlbum } from './album';
import { user } from './user';
import { externalUrls } from './spotify';

interface SimpleTrackParams {
  artists?: number;
  disc_number?: number;
  duration_ms?: number;
  is_playable?: boolean;
  linked_from?: SpotifyAPI.LinkedTrack;
  track_number?: number;
}
interface TrackParams extends SimpleTrackParams {
  popularity?: OneToHundred;
}
interface PlaylistTrackParams extends TrackParams {
  added_at?: string;
}

export const simpleTrack = (i: number, params?: SimpleTrackParams): SpotifyAPI.SimpleTrack => ({
  artists: [...new Array(params?.artists ?? 1)].map((_, j) => simpleArtist(j)),
  available_markets: ['JP'],
  disc_number: params?.disc_number ?? 1,
  duration_ms: 0,
  explicit: false,
  external_urls: externalUrls(i),
  href: `path/to/track${i}`,
  id: `track${i}`,
  is_playable: params?.is_playable ?? true,
  is_local: false,
  linked_from: params?.linked_from,
  restrictions: {},
  name: `name${i}`,
  preview_url: 'path/to/preview',
  track_number: 1,
  type: 'track',
  uri: `uri${i}`,
});

export const track = (i: number, params?: TrackParams): SpotifyAPI.Track => ({
  ...simpleTrack(i, params),
  album: simpleAlbum(i, params?.artists ?? 1),
  external_ids: {},
  popularity: params?.popularity ?? 50,
});

export const playlistTrack = (i: number, params?: PlaylistTrackParams): SpotifyAPI.PlaylistTrack => ({
  added_at: params?.added_at ?? new Date().toISOString(),
  added_by: user(i),
  is_local: false,
  track: track(i, params),
});
