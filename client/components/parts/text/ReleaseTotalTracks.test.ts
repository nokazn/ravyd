import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ReleaseTotalTracks from './ReleaseTotalTracks.vue';

describe('ReleaseTotalTracks', () => {
  it('increment total track counts', async () => {
    const wrapper = mount(ReleaseTotalTracks, {
      ...options,
      propsData: {
        total: 50,
      },
    });
    const text = wrapper.find('span > span');
    expect(text.text()).toBe('50曲');
    expect(wrapper.attributes().title).toBe('全50曲');

    await wrapper.setProps({
      total: 100,
    });
    expect(text.text()).toBe('100曲');
    expect(wrapper.attributes().title).toBe('全100曲');
  });
});
