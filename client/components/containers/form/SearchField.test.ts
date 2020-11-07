import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import SearchField from './SearchField.vue';

const SEARCH_FIELD_REF = 'SEARCH_FIELD_REF';
const FOCUS = 'focus';
const BLUR = 'blur';
const CLICK = 'click';

const UPDATE_QUERY = 'update:query';
const UPDATE_MENU = 'update:menu';
// const UPDATE_SEARCHING = 'update:searching';

const $keyboard = {
  add: jest.fn(),
  remove: jest.fn(),
};

const $dispatch = jest.fn();
const factory = (query: string = '', menu: boolean = false, searching: boolean = false) => {
  return mount(SearchField, {
    ...options,
    propsData: {
      query,
      menu,
      searching,
    },
    mocks: {
      ...mocks,
      $keyboard,
      $dispatch,
    },
  });
};

describe('SearchField', () => {
  it('emit on focus', async () => {
    const wrapper = factory();
    // https://github.com/vuejs/vue-test-utils/issues/1385
    const vTextField = wrapper.findComponent({ ref: SEARCH_FIELD_REF });
    await vTextField.vm.$emit(FOCUS);
    expect(wrapper.emitted(UPDATE_MENU)?.[0][0]).toBe(true);
    await vTextField.vm.$emit(BLUR);
    expect(wrapper.emitted(UPDATE_MENU)?.[1][0]).toBe(false);
  });

  it('clear text', async () => {
    const wrapper = factory('a', true);
    // @ts-ignore
    expect(wrapper.vm.queryRef).toBe('a');
    await wrapper.find('div.v-input__append-inner > div > .v-btn').trigger(CLICK);
    expect(wrapper.emitted(UPDATE_QUERY)?.[0][0]).toBe('');
  });
});
