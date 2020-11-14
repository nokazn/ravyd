import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

window.IntersectionObserver = jest.fn().mockReturnValue({
  observe: () => {},
  unobserve: () => {},
  disconnect: () => {},
});
