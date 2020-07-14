import { Getters } from 'vuex';

import { PlayerState } from './state';
import { REPEAT_STATE_LIST, TRACK_LIST_ARTWORK_SIZE } from '~/variables';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertTrackForQueue } from '~/scripts/converter/convertTrackForQueue';
import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { SpotifyAPI, App } from '~~/types';

export type PlayerGetters = {
  isPlayerConnected: boolean
  activeDevice: SpotifyAPI.Device | undefined
  isThisAppPlaying: boolean
  trackQueue: (artworkSize?: number) => App.TrackQueueInfo[]
  releaseId: string | undefined
  artworkSrc: (minSize?: number) => string | undefined
  hasTrack: boolean
  isTrackSet: (trackId: string) => boolean
  contextUri: string | undefined
  isContextSet: (uri: string | undefined) => boolean
  remainingTimeMs: number
  repeatState: SpotifyAPI.RepeatState | undefined
  isDisallowed: (disallow: keyof SpotifyAPI.Disallows) => boolean
  volumePercent: number
}

export type RootGetters = {
  ['player/isPlayerConnected']: PlayerGetters['isPlayerConnected']
  ['player/activeDevice']: PlayerGetters['activeDevice']
  ['player/isThisAppPlaying']: PlayerGetters['isThisAppPlaying']
  ['player/trackQueue']: PlayerGetters['trackQueue']
  ['player/releaseId']: PlayerGetters['releaseId']
  ['player/artworkSrc']: PlayerGetters['artworkSrc']
  ['player/hasTrack']: PlayerGetters['hasTrack']
  ['player/isTrackSet']: PlayerGetters['isTrackSet']
  ['player/contextUri']: PlayerGetters['contextUri']
  ['player/isContextSet']: PlayerGetters['isContextSet']
  ['player/remainingTimeMs']: PlayerGetters['remainingTimeMs']
  ['player/repeatState']: PlayerGetters['repeatState']
  ['player/isDisallowed']: PlayerGetters['isDisallowed']
  ['player/volumePercent']: PlayerGetters['volumePercent']
}

const playerGetters: Getters<PlayerState, PlayerGetters> = {
  isPlayerConnected(state) {
    return state.playbackPlayer != null;
  },

  activeDevice(state) {
    const activeDevice = state.deviceList?.find((device) => device.is_active);
    return activeDevice != null
      ? activeDevice
      : undefined;
  },

  isThisAppPlaying(state, getters) {
    return getters.activeDevice?.id === state.deviceId;
  },

  trackQueue(state, getters) {
    return (artworkSize = TRACK_LIST_ARTWORK_SIZE) => {
      if (!getters.hasTrack) return [];

      // hasTrack が true の場合 trackId, trackName, trackUri, releaseName, releaseUri, artistList は存在
      const currentTrack = {
        isSet: true,
        isPlaying: state.isPlaying,
        id: state.trackId,
        name: state.trackName!,
        uri: state.trackUri!,
        releaseId: getters.releaseId!,
        releaseName: state.releaseName!,
        artistList: state.artistList!,
        artworkSrc: getImageSrc(state.artWorkList, artworkSize),
        durationMs: state.durationMs,
      };
      const previousTrackList = state.previousTrackList
        .map(convertTrackForQueue(false, false, artworkSize));
      const nextTrackList = state.nextTrackList
        .map(convertTrackForQueue(false, false, artworkSize));

      return [
        ...previousTrackList,
        currentTrack,
        ...nextTrackList,
      ];
    };
  },

  releaseId(state) {
    // 最後の ":" 以降を取り出す
    return state.releaseUri != null
      ? convertUriToId(state.releaseUri)
      : undefined;
  },

  artworkSrc(state) {
    return (minSize?: number) => (state.artWorkList != null
      ? getImageSrc(state.artWorkList, minSize)
      : undefined);
  },

  hasTrack(state) {
    return state.trackId != null
      && state.trackName != null
      && state.trackUri != null
      && state.releaseName != null
      && state.releaseUri != null
      && state.artistList != null;
  },

  isTrackSet(state) {
    // id を指定
    return (trackId) => state.trackId === trackId;
  },

  contextUri(state) {
    return state.contextUri ?? state.customContextUri;
  },

  /**
   * uri を指定
   * アーティストページのトラックリストやコレクションから再生すると customContextUri に uri が保持される
   */
  isContextSet(_, getters) {
    return (uri) => uri != null && (getters.contextUri === uri);
  },

  isDisallowed(state) {
    return (disallow) => !!state.disallows[disallow];
  },

  remainingTimeMs(state) {
    return Math.max(state.durationMs - state.positionMs, 0);
  },

  repeatState(state) {
    return state.repeatMode != null
      ? REPEAT_STATE_LIST[state.repeatMode]
      : undefined;
  },

  volumePercent(state) {
    return state.isMuted ? 0 : state.volumePercent;
  },
};

export default playerGetters;
