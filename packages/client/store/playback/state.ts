import type { SpotifyAPI, ZeroToHundred } from 'shared/types';
import type { App } from '~/entities';

export type State = {
  pollingPlaybackTimer: ReturnType<typeof setTimeout> | number | undefined;
  deviceId: string | undefined;
  activeDeviceId: string | undefined;
  deviceList: SpotifyAPI.Device[];
  isPlaybackSleep: boolean;
  contextUri: string | undefined;
  track: App.ExtendedTrack | undefined;
  customContextUri: string | undefined;
  customTrackUriList: string[] | undefined;
  nextTrackList: Spotify.Track[];
  previousTrackList: Spotify.Track[];
  isPlaying: boolean;
  isSavedTrack: boolean;
  positionMs: number;
  disabledPlayingFromBeginning: boolean;
  durationMs: number;
  isShuffled: boolean;
  repeatMode: 0 | 1 | 2 | undefined;
  disallows: SpotifyAPI.Disallows;
  volumePercent: ZeroToHundred;
  isMuted: boolean;
}

const state = (): State => ({
  pollingPlaybackTimer: undefined,
  deviceId: undefined,
  activeDeviceId: undefined,
  deviceList: [],
  isPlaybackSleep: false,
  contextUri: undefined,
  track: undefined,
  customContextUri: undefined,
  customTrackUriList: undefined,
  nextTrackList: [],
  previousTrackList: [],
  isPlaying: false,
  isSavedTrack: false,
  positionMs: 0,
  disabledPlayingFromBeginning: false,
  // if set to 0, Seekbar has 0 length
  durationMs: 1,
  isShuffled: false,
  repeatMode: undefined,
  disallows: {},
  volumePercent: 100,
  isMuted: false,
});

export default state;
