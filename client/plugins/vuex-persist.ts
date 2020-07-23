import VuexPersistence from 'vuex-persist';
import { Context } from '@nuxt/types';
import { RootState } from 'typed-vuex';

export default ({ store }: Context) => {
  window.onNuxtReady(() => {
    new VuexPersistence<RootState>({
      modules: [],
    }).plugin(store);
  });
};
