import Vue from 'vue';
import { ExtendedStore } from 'vuex';

const injectStoreIntoVue = (definedPropertyName: string, srcProperty: keyof ExtendedStore) => {
  Object.defineProperty(Vue.prototype, definedPropertyName, {
    get(this: Vue) {
      return this.$store[srcProperty];
    },
  });
};

injectStoreIntoVue('$state', 'state');
injectStoreIntoVue('$getters', 'getters');
injectStoreIntoVue('$commit', 'commit');
injectStoreIntoVue('$dispatch', 'dispatch');
