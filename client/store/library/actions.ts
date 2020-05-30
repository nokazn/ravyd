import { Actions } from 'vuex';

import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { LibraryState } from './state';
import { LibraryGetters } from './getters';
import { LibraryMutations } from './mutations';

export type LibraryActions = {
  getSavedTrackList: (payload?: { limit: number } | undefined) => Promise<void>
  saveTracks: (trackIdList: string[]) => Promise<void>
  removeTracks: (trackIdList: string[]) => Promise<void>
};

export type RootActions = {
  'library/getSavedTrackList': LibraryActions['getSavedTrackList']
  'library/saveTracks': LibraryActions['saveTracks']
  'library/removeTracks': LibraryActions['removeTracks']
};

const actions: Actions<LibraryState, LibraryActions, LibraryGetters, LibraryMutations> = {
  async getSavedTrackList({ commit, getters, rootGetters }, payload) {
    const limit = payload?.limit;
    const market = rootGetters['auth/userCountryCode'];
    if (market == null) return;

    const offset = getters.trackListOffset;
    const tracks = await this.$spotify.library.getUserSavedTracks({
      limit,
      offset,
      market,
    });
    if (tracks == null) {
      commit('SET_TRACK_LIST', null);
      return;
    }

    const trackIdList = tracks.items.map(({ track }) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = tracks.items
      .map(convertPlaylistTrackDetail({ isTrackSavedList }));

    commit('SET_TRACK_LIST', trackList);
  },

  async saveTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.saveTracks({ trackIdList });

    const isCurrentTrackSavedStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isCurrentTrackSavedStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },

  async removeTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.removeUserSavedTracks({ trackIdList });

    const isCurrentTrackSavedStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isCurrentTrackSavedStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },
};

export default actions;
