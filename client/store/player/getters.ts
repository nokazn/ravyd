import { Getters } from 'vuex';

import { PlayerState } from './state';
import { REPEAT_STATE_LIST } from '~/variables';
import { SpotifyAPI } from '~~/types';

export type PlayerGetters = {
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
  activeDevice: SpotifyAPI.Device | null
}

export type RootGetters = {
  ['player/recentlyPlayedTrackList']: PlayerGetters['recentlyPlayedTrackList']
  ['player/repeatState']: PlayerGetters['repeatState']
  ['player/activeDevice']: PlayerGetters['activeDevice']
}

const getters: Getters<PlayerState, PlayerGetters> = {
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

  repeatState(state) {
    return REPEAT_STATE_LIST[state.repeatMode];
  },

  activeDevice(state) {
    const activeDevice = state.activeDeviceList?.filter((device) => device.is_active);
    return activeDevice != null && activeDevice.length > 0
      ? activeDevice[0]
      : null;
  },
};

export default getters;
