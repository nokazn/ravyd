import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TrackTime from './TrackTime.vue';

describe('TrackTime', () => {
  it('modify track time', async () => {
    const wrapper = mount(TrackTime, {
      ...options,
      propsData: {
        timeMs: 60 * 1000,
      },
    });
    expect(wrapper.text()).toBe('1:00');
    expect(wrapper.attributes().title).toBe('1分0秒');

    await wrapper.setProps({
      timeMs: 90 * 1000,
    });
    expect(wrapper.text()).toBe('1:30');
    expect(wrapper.attributes().title).toBe('1分30秒');
  });
});
