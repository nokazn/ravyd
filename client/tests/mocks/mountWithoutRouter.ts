import { createLocalVue, RouterLinkStub } from '@vue/test-utils';
import CompositionApi from '@vue/composition-api';
import Vuetify from 'vuetify';
import * as $constant from '~/constants';

const localVue = createLocalVue();
localVue.use(CompositionApi);
// inject at ~/tests/jest.setup.js because of duplicated $attrs prop
// localVue.use(Vuetify);

const mocks = {
  $constant,
};
const stubs = {
  NuxtLink: RouterLinkStub,
  ClientOnly: true,
};
const vuetify = new Vuetify({});

const options = {
  localVue,
  mocks,
  stubs,
  vuetify,
};

export {
  localVue,
  mocks,
  stubs,
  vuetify,
  options,
};
