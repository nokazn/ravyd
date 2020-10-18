import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import PlaylistMediaButton from './PlaylistMediaButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('PlaylistMediaButton', () => {
  it('playling', async () => {
    const wrapper = mount(PlaylistMediaButton, {
      ...options,
      propsData: {
        value: true,
        disabled: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-pause');
    expect(wrapper.attributes('title')).toBe('停止');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('not playling', async () => {
    const wrapper = mount(PlaylistMediaButton, {
      ...options,
      propsData: {
        value: false,
        disabled: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-play');
    expect(wrapper.attributes('title')).toBe('再生');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });

  it('disabled with playing', async () => {
    const wrapper = mount(PlaylistMediaButton, {
      ...options,
      propsData: {
        value: true,
        disabled: true,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-play');
    expect(wrapper.attributes('title')).toBe('再生できない項目');
  });

  it('disabled with not playling', async () => {
    const wrapper = mount(PlaylistMediaButton, {
      ...options,
      propsData: {
        value: false,
        disabled: true,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-play');
    expect(wrapper.attributes('title')).toBe('再生できない項目');
  });
});
