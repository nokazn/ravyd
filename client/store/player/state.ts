import type { SpotifyAPI } from '~~/types';

export type PlayerState = {
  deviceId: string | null
  activeDeviceList: SpotifyAPI.Device[]
  artWorkSrc: string | null
  trackName: string | null
  trackId: string | null
  trackUri: string | null
  albumUri: string | null
  artistList: {
    name: string
    id: string
  }[] | null
  nextTrackList: Spotify.Track[]
  previousTrackList: Spotify.Track[]
  recentlyPlayed: SpotifyAPI.Player.RecentlyPlayed | null
  isSavedTrack: boolean
  isPlaying: boolean
  position: number
  duration: number
  isShuffled: boolean
  repeatMode: 0 | 1 | 2
  disallowList: string[]
  volume: number
}

export type RootState = {
  'player/deviceId': PlayerState['deviceId']
  'player/activeDeviceList': PlayerState['activeDeviceList']
  'player/artWorkSrc': PlayerState['artWorkSrc']
  'player/trackName': PlayerState['trackName']
  'player/trackId': PlayerState['trackId']
  'player/trackUri': PlayerState['trackUri']
  'player/albumUri': PlayerState['albumUri']
  'player/artistList': PlayerState['artistList']
  'player/nextTrackList': PlayerState['nextTrackList']
  'player/previousTrackList': PlayerState['previousTrackList']
  'player/recentlyPlayed': PlayerState['recentlyPlayed']
  'player/isSavedTrack': PlayerState['isSavedTrack']
  'player/isPlaying': PlayerState['isPlaying']
  'player/position': PlayerState['position']
  'player/duration': PlayerState['duration']
  'player/isShuffled': PlayerState['isShuffled']
  'player/repeatMode': PlayerState['repeatMode']
  'player/disallowList': PlayerState['disallowList']
  'player/volume': PlayerState['volume']
}

const state = (): PlayerState => ({
  deviceId: null,
  activeDeviceList: [],
  artWorkSrc: null,
  trackName: null,
  trackId: null,
  trackUri: null,
  albumUri: null,
  artistList: [],
  nextTrackList: [],
  previousTrackList: [],
  recentlyPlayed: null,
  isSavedTrack: false,
  isPlaying: false,
  position: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 0,
  disallowList: [],
  volume: 0,
});

export default state;
