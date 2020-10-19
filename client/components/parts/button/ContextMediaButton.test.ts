import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ContextMediaButton from './ContextMediaButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('ContextMediaButton', () => {
  it('in playing', async () => {
    const wrapper = mount(ContextMediaButton, {
      ...options,
      propsData: {
        value: true,
        fab: false,
      },
    });
    expect(wrapper.find('span').text()).toBe('停止');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('in paused', async () => {
    const wrapper = mount(ContextMediaButton, {
      ...options,
      propsData: {
        value: false,
        fab: false,
      },
    });
    expect(wrapper.find('span').text()).toBe('再生');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
