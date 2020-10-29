import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ReleaseLabel from './ReleaseLabel.vue';
import TextInfo from '~/components/parts/text/TextInfo.vue';

describe('ReleaseLabel', () => {
  it('icon', () => {
    const wrapper = mount(ReleaseLabel, {
      ...options,
      propsData: {
        label: 'Foo Records',
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
    expect(text.attributes('title')).toBe('レーベル - Foo Records');
    expect(text.text()).toBe('Foo Records');
    expect(wrapper.find('.v-icon').exists()).toBe(true);
  });

  it('text', () => {
    const wrapper = mount(ReleaseLabel, {
      ...options,
      propsData: {
        label: 'Foo Records',
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
    expect(text.attributes('title')).toBe('レーベル - Foo Records');
    expect(text.text()).toBe('Foo Records');
    expect(wrapper.find('.v-icon').exists()).toBe(false);
  });
});
