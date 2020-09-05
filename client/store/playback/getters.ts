import { Getters } from 'typed-vuex';

import { PlaybackState } from './state';
import { REPEAT_STATE_LIST, DEFAULT_DURATION_MS } from '~/constants';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertTrackForQueue } from '~/scripts/converter/convertTrackForQueue';
import { convertUriToId } from '~/scripts/converter/convertUriToId';
import { getExternalUrlFromUri } from '~~/utils/getExternalUrlFromUri';
import { SpotifyAPI, App, ZeroToHundred } from '~~/types';

export type PlaybackGetters = {
  activeDevice: SpotifyAPI.Device | undefined
  deviceList: App.DeviceInfo[]
  isThisAppPlaying: boolean
  currentTrack: App.SimpleTrackDetail | undefined
  trackQueue: App.TrackQueueInfo[]
  releaseId: string | undefined
  artworkSrc: (minSize?: number) => string | undefined
  hasTrack: boolean
  isTrackSet: (trackId: string) => boolean
  contextUri: string | undefined
  isContextSet: (uri: string | undefined) => boolean
  remainingTimeMs: number
  repeatState: SpotifyAPI.RepeatState | undefined
  isDisallowed: (disallow: keyof SpotifyAPI.Disallows) => boolean
  volumePercent: ZeroToHundred
}

export type RootGetters = {
  'playback/activeDevice': PlaybackGetters['activeDevice']
  'playback/deviceList': PlaybackGetters['deviceList']
  'playback/isThisAppPlaying': PlaybackGetters['isThisAppPlaying']
  'playback/currentTrack': PlaybackGetters['currentTrack']
  'playback/trackQueue': PlaybackGetters['trackQueue']
  'playback/releaseId': PlaybackGetters['releaseId']
  'playback/artworkSrc': PlaybackGetters['artworkSrc']
  'playback/hasTrack': PlaybackGetters['hasTrack']
  'playback/isTrackSet': PlaybackGetters['isTrackSet']
  'playback/contextUri': PlaybackGetters['contextUri']
  'playback/isContextSet': PlaybackGetters['isContextSet']
  'playback/remainingTimeMs': PlaybackGetters['remainingTimeMs']
  'playback/repeatState': PlaybackGetters['repeatState']
  'playback/isDisallowed': PlaybackGetters['isDisallowed']
  'playback/volumePercent': PlaybackGetters['volumePercent']
}

const playerGetters: Getters<PlaybackState, PlaybackGetters> = {
  activeDevice(state) {
    const activeDevice = state.deviceList?.find((device) => device.is_active);
    return activeDevice != null
      ? activeDevice
      : undefined;
  },

  deviceList(state, getters) {
    const disabled = getters.isDisallowed('transferring_playback');

    return state.deviceList.map((device) => ({
      id: device.id ?? undefined,
      type: device.type,
      isActive: device.is_active,
      disabled: device.id == null || disabled,
      title: device.is_active
        ? '再生中のデバイス'
        : device.name,
      subtitle: device.is_active
        ? device.name
        : 'Spotify Connect',
    }));
  },

  isThisAppPlaying(state, getters) {
    return state.deviceId != null && getters.activeDevice?.id === state.deviceId;
  },

  currentTrack(state, getters) {
    const {
      trackId,
      trackName,
      trackUri,
      artists,
      releaseName,
      releaseUri,
      images,
      durationMs,
      isSavedTrack: isSaved,
      linkedFrom,
    } = state;
    const { releaseId } = getters;

    if (trackId == null
      || trackName == null
      || trackUri == null
      || artists == null
      || releaseName == null
      || releaseUri == null
      || images == null
      || releaseId == null) return undefined;

    // Spotify で開く用のリンク
    const spotify = getExternalUrlFromUri(trackUri);
    const externalUrls: SpotifyAPI.ExternalUrls = spotify != null
      ? { spotify }
      : {};

    return {
      index: -1,
      id: trackId,
      name: trackName,
      uri: trackUri,
      artists,
      featuredArtistList: [],
      durationMs,
      externalUrls,
      previewUrl: {},
      isSaved,
      releaseId,
      releaseName,
      images,
      linkedFrom,
    };
  },

  trackQueue(state, getters) {
    if (!getters.hasTrack) return [];

    // hasTrack が true の場合 trackId, trackName, trackUri, releaseName, releaseUri, artists は存在
    const currentTrack = {
      isSet: true,
      isPlaying: state.isPlaying,
      index: 0,
      id: state.trackId,
      name: state.trackName!,
      uri: state.trackUri!,
      releaseId: getters.releaseId!,
      releaseName: state.releaseName!,
      artists: state.artists!,
      images: state.images ?? [],
      durationMs: state.durationMs,
      linkedFrom: state.linkedFrom,
    };

    const prevLength = Math.min(state.previousTrackList.length, 2);
    // 前後2曲まで含める
    const previousTrackList = state.previousTrackList
      .slice(0, 2)
      .map(convertTrackForQueue({
        isSet: false,
        isPlaying: false,
        offset: -1 * prevLength,
      }));

    const nextTrackList = state.nextTrackList
      .slice(0, 2)
      .map(convertTrackForQueue({
        isSet: false,
        isPlaying: false,
        offset: 1,
      }));

    return [
      ...previousTrackList,
      currentTrack,
      ...nextTrackList,
    ];
  },

  releaseId(state) {
    // 最後の ":" 以降を取り出す
    return state.releaseUri != null
      ? convertUriToId(state.releaseUri)
      : undefined;
  },

  artworkSrc(state) {
    return (minSize?: number) => getImageSrc(state.images, minSize);
  },

  hasTrack(state) {
    return state.trackId != null
      && state.trackName != null
      && state.trackUri != null
      && state.releaseName != null
      && state.releaseUri != null
      && state.artists != null
      && state.durationMs > 0 && state.durationMs !== DEFAULT_DURATION_MS;
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
