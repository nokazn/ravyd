import { mount } from '@vue/test-utils';
import ShowAllButton from './ShowAllButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('ShowAllButton', () => {
  it('showing all', async () => {
    const wrapper = mount(ShowAllButton, {
      propsData: {
        value: true,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-chevron-up');
    expect(wrapper.attributes('title')).toBe('折りたたむ');
    expect(wrapper.find('div > span').text()).toBe('折りたたむ');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('folded', async () => {
    const wrapper = mount(ShowAllButton, {
      propsData: {
        value: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-chevron-down');
    expect(wrapper.attributes('title')).toBe('すべて表示');
    expect(wrapper.find('div > span').text()).toBe('すべて表示');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
