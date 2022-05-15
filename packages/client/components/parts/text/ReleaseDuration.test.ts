import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TextInfo from '~/components/parts/text/TextInfo.vue';
import ReleaseDuration from './ReleaseDuration.vue';

describe('ReleaseDuration', () => {
  it('icon', () => {
    const wrapper = mount(ReleaseDuration, {
      ...options,
      propsData: {
        durationMs: 55 * 60 * 1000 + 30 * 1000,
        hasMore: true,
        icon: true,
      },
    });
    const text = wrapper.findComponent(TextInfo);
    expect(text.props()).toEqual({
      tag: undefined,
      props: undefined,
      size: undefined,
      icon: true,
      subtext: false,
    });
    expect(text.attributes('title')).toBe('全55分30秒 + α');
    expect(text.text()).toBe('55分30秒 + α');
    expect(wrapper.find('.v-icon').exists()).toBe(true);
  });

  it('text', () => {
    const wrapper = mount(ReleaseDuration, {
      ...options,
      propsData: {
        durationMs: 55 * 60 * 1000 + 30 * 1000,
        hasMore: true,
        size: 13,
        subtext: true,
      },
    });
    const text = wrapper.findComponent(TextInfo);
    expect(text.props()).toEqual({
      tag: undefined,
      props: undefined,
      size: 13,
      icon: false,
      subtext: true,
    });
    expect(text.attributes('title')).toBe('全55分30秒 + α');
    expect(text.text()).toBe('55分30秒 + α');
    expect(wrapper.find('.v-icon').exists()).toBe(false);
  });

  it('confirmed duration', async () => {
    const wrapper = mount(ReleaseDuration, {
      ...options,
      propsData: {
        durationMs: 55 * 60 * 1000 + 30 * 1000,
        hasMore: true,
      },
    });
    const text = wrapper.findComponent(TextInfo);
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
