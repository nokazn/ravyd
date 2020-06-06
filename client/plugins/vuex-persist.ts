import VuexPersistence from 'vuex-persist';
import { Store } from 'vuex';
import { RootState } from '~/store/types';

export default ({ store }: { store: Store<RootState> }) => {
  window.onNuxtReady(() => {
    new VuexPersistence<RootState>({
      modules: [],
    }).plugin(store);
  });
};
