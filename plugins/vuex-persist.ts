import VuexPersistence from 'vuex-persist';
import { Store } from 'vuex';
import { RootState } from '@/store';

export default ({ store }: { store: Store<RootState> }) => {
  // @ts-ignore @todo
  window.onNuxtReady(() => {
    new VuexPersistence<RootState>({
      modules: [
        'auth',
      ],
    }).plugin(store);
  });
};
