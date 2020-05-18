import { Actions } from 'vuex';

import { LibraryState } from './state';
import { LibraryGetters } from './getters';
import { LibraryMutations } from './mutations';

export type LibraryActions = {
  saveTracks: (trackIdList: string[]) => Promise<void>
  removeTracks: (trackIdList: string[]) => Promise<void>
};

export type RootActions = {
  'library/saveTracks': LibraryActions['saveTracks']
  'library/removeTracks': LibraryActions['removeTracks']
};

const actions: Actions<LibraryState, LibraryActions, LibraryGetters, LibraryMutations> = {
  async saveTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.saveTracks({ trackIdList });

    const isSetTrackFavoriteStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isSetTrackFavoriteStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },

  async removeTracks({ dispatch, rootState }, trackIdList) {
    await this.$spotify.library.removeUserSavedTracks({ trackIdList });

    const isSetTrackFavoriteStateChanged = rootState.player.trackId != null
      && trackIdList.includes(rootState.player.trackId);
    if (isSetTrackFavoriteStateChanged) {
      dispatch('player/checkSavedTracks', undefined, { root: true });
    }
  },
};

export default actions;
