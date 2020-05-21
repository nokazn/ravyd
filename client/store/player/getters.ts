import { Getters } from 'vuex';

import { PlayerState } from './state';
import { REPEAT_STATE_LIST } from '~/variables';
import { SpotifyAPI } from '~~/types';

export type PlayerGetters = {
  activeDevice: SpotifyAPI.Device | null
  albumId: string | null
  isTrackSet: (trackId: string) => boolean
  isAlbumSet: (albumId: string) => boolean
  isArtistSet: (artistId: string) => boolean
  recentlyPlayedTrackList: {
    artWorkSrc: string | null
    trackName: string | null
    trackId: string | null
    artists: {
      name: string
      id: string
    }[] | null
  }[] | null
  repeatState: SpotifyAPI.RepeatState
  isPreviousDisallowed: boolean
  isShuffleDisallowed: boolean
  isRepeatContextDisallowed: boolean
  isRepeatTrackDisallowed: boolean
}

export type RootGetters = {
  ['player/activeDevice']: PlayerGetters['activeDevice']
  ['player/albumId']: PlayerGetters['albumId']
  ['player/isTrackSet']: PlayerGetters['isTrackSet']
  ['player/isAlbumSet']: PlayerGetters['isAlbumSet']
  ['player/isArtistSet']: PlayerGetters['isArtistSet']
  ['player/recentlyPlayedTrackList']: PlayerGetters['recentlyPlayedTrackList']
  ['player/repeatState']: PlayerGetters['repeatState']
  ['player/isPreviousDisallowed']: PlayerGetters['isPreviousDisallowed']
  ['player/isShuffleDisallowed']: PlayerGetters['isShuffleDisallowed']
  ['player/isRepeatContextDisallowed']: PlayerGetters['isRepeatContextDisallowed']
  ['player/isRepeatTrackDisallowed']: PlayerGetters['isRepeatTrackDisallowed']
}

const playerGetters: Getters<PlayerState, PlayerGetters> = {
  activeDevice(state) {
    const activeDevice = state.activeDeviceList?.filter((device) => device.is_active);
    return activeDevice != null && activeDevice.length > 0
      ? activeDevice[0]
      : null;
  },

  albumId(state) {
    // 最後の ":" 以降を取り出す
    return state.albumUri?.replace(/^.+:(.+)$/, '$1') ?? null;
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

  recentlyPlayedTrackList(state) {
    if (state.recentlyPlayed == null) return null;

    return state.recentlyPlayed.items.map((item) => {
      const { track } = item;
      return {
        artWorkSrc: track.album.images[0]?.url ?? null,
        trackName: track.name,
        trackId: track.id,
        artists: track.album.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
      };
    });
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
};

export default playerGetters;
