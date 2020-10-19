import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

// @ts-ignore
window.IntersectionObserver = jest.fn(() => ({
  observe: () => {},
  unobserve: () => {},
}));
