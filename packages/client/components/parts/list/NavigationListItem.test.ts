import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import NavigationListItem from './NavigationListItem.vue';

const activeClass = 'active--text';
const item = (isSet: boolean, isPlaying: boolean) => ({
  name: 'name',
  to: 'path/to/link',
  icon: 'icon',
  isSet,
  isPlaying,
});
const factory = (isSet: boolean, isPlaying: boolean) => {
  return mount(NavigationListItem, {
    ...options,
    propsData: {
      item: item(isSet, isPlaying),
    },
  });
};

describe('NavigationListItem', () => {
  it('normal item', () => {
    const wrapper = factory(false, false);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).not.toContain(activeClass);
    expect(title.find('.v-icon').exists()).toBe(false);
  });

  it('set item', () => {
    const wrapper = factory(true, false);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).toContain(activeClass);
    expect(title.find('.v-icon').exists()).toBe(false);
  });

  it('playing item', () => {
    const wrapper = factory(true, true);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).toContain(activeClass);
    expect(title.find('.v-icon').exists()).toBe(true);
    expect(title.find('.v-icon').classes()).toContain(activeClass);
  });

  it('set to normal, and then set to playing', async () => {
    const wrapper = factory(false, false);
    const title = wrapper.find('.v-list-item__title');
    expect(title.classes()).not.toContain(activeClass);
    expect(title.find('.v-icon').exists()).toBe(false);

    await wrapper.setProps({
      item: item(true, false),
    });
    expect(title.classes()).toContain(activeClass);
    expect(title.find('.v-icon').exists()).toBe(false);

    await wrapper.setProps({
      item: item(true, true),
    });
    expect(title.classes()).toContain(activeClass);
    const icon = title.find('.v-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain(activeClass);
  });

  it.todo('dense prop');
});
