import { Actions } from 'vuex';

import { LibraryState } from './state';
import { LibraryGetters } from './getters';
import { LibraryMutations } from './mutations';

export type LibraryActions = {
  saveTracks: (trackIds: string | string[]) => Promise<void>
  removeTracks: (trackIds: string | string[]) => Promise<void>
};

export type RootActions = {
  'library/saveTracks': LibraryActions['saveTracks']
  'library/removeTracks': LibraryActions['removeTracks']
};

const actions: Actions<LibraryState, LibraryActions, LibraryGetters, LibraryMutations> = {
  async saveTracks(_, trackIds) {
    const ids = Array.isArray(trackIds)
      ? trackIds.join(',')
      : trackIds;
    await this.$spotifyApi.$put('/me/tracks', null, {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  },

  async removeTracks(_, trackIds) {
    const ids = Array.isArray(trackIds)
      ? trackIds.join(',')
      : trackIds;
    await this.$spotifyApi.$delete('/me/tracks', {
      params: {
        ids,
      },
    }).catch((err: Error) => {
      console.error({ err });
    });
  },

};

export default actions;
