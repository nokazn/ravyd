import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TextInfo from '~/components/parts/text/TextInfo.vue';
import ReleaseTotalTracks from './ReleaseTotalTracks.vue';

describe('ReleaseTotalTracks', () => {
  it('icon', () => {
    const wrapper = mount(ReleaseTotalTracks, {
      ...options,
      propsData: {
        total: 100,
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
    expect(text.attributes('title')).toBe('全100曲');
    expect(text.text()).toBe('100曲');
    expect(wrapper.find('.v-icon').exists()).toBe(true);
  });

  it('text', () => {
    const wrapper = mount(ReleaseTotalTracks, {
      ...options,
      propsData: {
        total: 100,
        unit: '個',
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
    expect(text.attributes('title')).toBe('全100個');
    expect(text.text()).toBe('100個');
    expect(wrapper.find('.v-icon').exists()).toBe(false);
  });

  it('increment total track counts', async () => {
    const wrapper = mount(ReleaseTotalTracks, {
      ...options,
      propsData: {
        total: 50,
      },
    });
    const text = wrapper.findComponent(TextInfo);
    expect(text.text()).toBe('50曲');
    expect(wrapper.attributes().title).toBe('全50曲');

    await wrapper.setProps({
      total: 100,
    });
    expect(text.text()).toBe('100曲');
    expect(wrapper.attributes().title).toBe('全100曲');
  });
});
