import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ReleaseDuration from './ReleaseDuration.vue';

describe('ReleaseDuration', () => {
  it('confirm duration', async () => {
    const wrapper = mount(ReleaseDuration, {
      ...options,
      propsData: {
        durationMs: 55 * 60 * 1000 + 30 * 1000,
        hasMore: true,
      },
    });
    const text = wrapper.find('span > span');
    expect(text.text()).toBe('55分30秒 + α');
    expect(wrapper.attributes().title).toBe('全55分30秒 + α');

    await wrapper.setProps({
      durationMs: 90 * 60 * 1000 + 30 * 1000,
      hasMore: false,
    });
    // ignore '30 seconds'
    expect(text.text()).toBe('1時間30分');
    expect(wrapper.attributes().title).toBe('全1時間30分');
  });
});
