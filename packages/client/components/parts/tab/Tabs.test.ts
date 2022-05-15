import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import { BACKGROUND_COLOR } from '~/constants';
import Tabs from './Tabs.vue';

const item = (i: number) => ({
  title: `title${i}`,
  to: `path/to${i}`,
});

describe('Tabs', () => {
  it('3 tabs', () => {
    const wrapper = mount(Tabs, {
      ...options,
      propsData: {
        items: [item(1), item(2), item(3)],
      },
    });
    const tabs = wrapper.findAll('.v-tab');
    expect(tabs.length).toBe(3);
    expect(tabs.at(0).props().to).toBe('path/to1');
    expect(tabs.at(0).text()).toBe('title1');
    expect(tabs.at(1).props().to).toBe('path/to2');
    expect(tabs.at(1).text()).toBe('title2');
    expect(tabs.at(2).props().to).toBe('path/to3');
    expect(tabs.at(2).text()).toBe('title3');
  });

  it('divider', async () => {
    const wrapper = mount(Tabs, {
      ...options,
      propsData: {
        items: [item(1), item(2), item(3)],
        divider: false,
      },
    });
    expect(wrapper.find('.v-divider').exists()).toBe(false);
  });

  it('height prop & normal color', async () => {
    const wrapper = mount(Tabs, {
      ...options,
      propsData: {
        items: [item(1), item(2), item(3)],
        height: 36,
        transparent: false,
      },
    });
    expect(wrapper.find('.v-tabs').props().height).toBe(36);
    expect(wrapper.find('.v-tabs').props().backgroundColor).toBe(BACKGROUND_COLOR);
  });

  it('transparent prop', async () => {
    const wrapper = mount(Tabs, {
      ...options,
      propsData: {
        items: [item(1), item(2), item(3)],
        transparent: true,
      },
    });
    expect(wrapper.find('.v-tabs').props().backgroundColor).toBe('transparent');
  });

  it('shadow prop', async () => {
    const wrapper = mount(Tabs, {
      ...options,
      propsData: {
        items: [item(1), item(2), item(3)],
        shadow: true,
      },
    });
    expect(wrapper.classes()).toContain('Tabs');
    expect(wrapper.classes()).toContain('shadow');
  });
});
