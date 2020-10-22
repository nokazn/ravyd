import { createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Router from 'vue-router';
import CompositionApi from '@vue/composition-api';
import Vuetify from 'vuetify';
import * as $constant from '~/constants';

const localVue = createLocalVue();
localVue.use(Router);
localVue.use(CompositionApi);
// inject at ~/tests/jest.setup.js because of duplicated $attrs prop
// localVue.use(Vuetify);

const router = new Router();
const mocks = {
  $constant,
};
const stubs = {
  NuxtLink: RouterLinkStub,
};

const options = {
  localVue,
  router,
  mocks,
  stubs,
  vuetify: new Vuetify({}),
};

export {
  localVue,
  router,
  mocks,
  stubs,
  options,
};
