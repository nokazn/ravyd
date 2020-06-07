import { Getters } from 'vuex';

import { PlayerState } from './state';
import { REPEAT_STATE_LIST, APP_NAME } from '~/variables';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertTrackForQueue } from '~/scripts/converter/convertTrackForQueue';
import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { SpotifyAPI, App } from '~~/types';

export type PlayerGetters = {
  isPlayerConnected: boolean
  activeDevice: SpotifyAPI.Device | null
  isTheAppPlaying: boolean
  trackQueue: (artworkSize?: number) => App.TrackQueueInfo[]
  albumId: string | null
  albumArtworkSrc: (minSize?: number) => string | null
  hasTrack: boolean
  isTrackSet: (trackId: string) => boolean
  isAlbumSet: (albumId: string) => boolean
  isArtistSet: (artistId: string) => boolean
  repeatState: SpotifyAPI.RepeatState
  isPreviousDisallowed: boolean
  isShuffleDisallowed: boolean
  isRepeatContextDisallowed: boolean
  isRepeatTrackDisallowed: boolean
  volume: number
}

export type RootGetters = {
  ['player/isPlayerConnected']: PlayerGetters['isPlayerConnected']
  ['player/activeDevice']: PlayerGetters['activeDevice']
  ['player/isTheAppPlaying']: PlayerGetters['isTheAppPlaying']
  ['player/trackQueue']: PlayerGetters['trackQueue']
  ['player/albumId']: PlayerGetters['albumId']
  ['player/albumArtworkSrc']: PlayerGetters['albumArtworkSrc']
  ['player/hasTrack']: PlayerGetters['hasTrack']
  ['player/isTrackSet']: PlayerGetters['isTrackSet']
  ['player/isAlbumSet']: PlayerGetters['isAlbumSet']
  ['player/isArtistSet']: PlayerGetters['isArtistSet']
  ['player/repeatState']: PlayerGetters['repeatState']
  ['player/isPreviousDisallowed']: PlayerGetters['isPreviousDisallowed']
  ['player/isShuffleDisallowed']: PlayerGetters['isShuffleDisallowed']
  ['player/isRepeatContextDisallowed']: PlayerGetters['isRepeatContextDisallowed']
  ['player/isRepeatTrackDisallowed']: PlayerGetters['isRepeatTrackDisallowed']
  ['player/volume']: PlayerGetters['volume']
}

const playerGetters: Getters<PlayerState, PlayerGetters> = {
  isPlayerConnected(state) {
    return state.playbackPlayer != null;
  },

  activeDevice(state) {
    const activeDevice = state.activeDeviceList?.filter((device) => device.is_active);
    return activeDevice != null && activeDevice.length > 0
      ? activeDevice[0]
      : null;
  },

  isTheAppPlaying(_state, getters) {
    return getters.activeDevice?.name === APP_NAME;
  },

  trackQueue(state, getters) {
    return (artworkSize = 64) => {
      if (state.albumArtWorkList == null) return [];

      const currentTrack = {
        isPlaying: true,
        id: state.trackId,
        name: state.trackName!,
        uri: state.trackUri!,
        artistList: state.artistList!,
        releaseName: state.albumName!,
        releaseId: getters.albumId!,
        artworkSrc: getImageSrc(state.albumArtWorkList!, artworkSize),
      };
      const previousTrackList = state.previousTrackList
        .map(convertTrackForQueue(false, artworkSize));
      const nextTrackList = state.nextTrackList
        .map(convertTrackForQueue(false, artworkSize));

      return [
        ...previousTrackList,
        currentTrack,
        ...nextTrackList,
      ];
    };
  },

  albumId(state) {
    // 最後の ":" 以降を取り出す
    return state.albumUri != null
      ? convertUriToId(state.albumUri)
      : null;
  },

  albumArtworkSrc(state) {
    return (minSize?: number) => (state.albumArtWorkList != null
      ? getImageSrc(state.albumArtWorkList, minSize)
      : null);
  },

  hasTrack(state) {
    return state.trackId != null
      && state.trackName != null
      && state.trackUri != null
      && state.albumName != null
      && state.albumUri != null
      && state.artistList != null;
  },

  isTrackSet(state) {
    return (trackId) => state.trackId === trackId;
  },

  isAlbumSet(_state, getters) {
    return (albumId) => getters.albumId === albumId;
  },

  isArtistSet(state) {
    return (artistId) => state.artistList?.some((artist) => artist.id === artistId) ?? false;
  },

  isShuffleDisallowed(state) {
    return state.disallowList.some((disallow) => disallow.includes('shuffle'));
  },

  repeatState(state) {
    return REPEAT_STATE_LIST[state.repeatMode];
  },

  isPreviousDisallowed(state) {
    return state.disallowList.some((disallow) => disallow.includes('prev'));
  },

  isRepeatContextDisallowed(state) {
    return state.disallowList.some((disallow) => disallow.includes('repeat_context'));
  },

  isRepeatTrackDisallowed(state) {
    return state.disallowList.some((disallow) => disallow.includes('repeat_track'));
  },

  volume(state) {
    return state.isMuted ? 0 : state.volume;
  },
};

export default playerGetters;
