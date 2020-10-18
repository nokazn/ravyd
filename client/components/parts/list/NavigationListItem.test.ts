import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import NavigationListItem from './NavigationListItem.vue';

const factory = (isSet: boolean, isPlaying: boolean) => {
  return mount(NavigationListItem, {
    ...options,
    propsData: {
      item: {
        name: 'name',
        to: 'path/to/link',
        icon: 'icon',
        isSet,
        isPlaying,
      },
    },
  });
};

describe('NavigationListItem', () => {
  it('normal item', () => {
    const wrapper = factory(false, false);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).not.toContain('active--text');
    expect(title.find('.v-icon').exists()).toBe(false);
  });
  it('set item', () => {
    const wrapper = factory(true, false);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).toContain('active--text');
    expect(title.find('.v-icon').exists()).toBe(false);
  });
  it('playing item', () => {
    const wrapper = factory(true, true);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).toContain('active--text');
    expect(title.find('.v-icon').exists()).toBe(true);
    expect(title.find('.v-icon').classes()).toContain('active--text');
  });
});
