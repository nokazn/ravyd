import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TextInfo from '~/components/parts/text/TextInfo.vue';
import ReleaseDate from './ReleaseDate.vue';

describe('ReleaseDate', () => {
  it('icon', () => {
    const wrapper = mount(ReleaseDate, {
      ...options,
      propsData: {
        releaseDate: '2020-09-29',
        releaseDatePrecision: 'day',
        icon: true,
      },
    });
    const text = wrapper.findComponent(TextInfo);
    expect(text.props()).toEqual({
      tag: 'time',
      props: {
        datetime: '2020-09-29',
      },
      size: undefined,
      icon: true,
      subtext: false,
    });
    expect(text.attributes('title')).toBe('2020年9月29日リリース');
    expect(text.text()).toBe('2020年9月29日');
    expect(wrapper.find('.v-icon').exists()).toBe(true);
  });

  it('text', () => {
    const wrapper = mount(ReleaseDate, {
      ...options,
      propsData: {
        releaseDate: '2020-09-29',
        releaseDatePrecision: 'day',
        size: 13,
        subtext: true,
      },
    });
    const text = wrapper.findComponent(TextInfo);
    expect(text.props()).toEqual({
      tag: 'time',
      props: {
        datetime: '2020-09-29',
      },
      size: 13,
      icon: false,
      subtext: true,
    });
    expect(text.attributes('title')).toBe('2020年9月29日リリース');
    expect(text.text()).toBe('2020年9月29日');
    expect(wrapper.find('.v-icon').exists()).toBe(false);
  });
});
