import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TextInfo from './TextInfo.vue';

describe('TextInfo', () => {
  it('icon with subtext', () => {
    const wrapper = mount(TextInfo, {
      ...options,
      propsData: {
        icon: true,
        size: 12,
        subtext: true,
      },
    });
    expect(wrapper.classes()).toContain('subtext--text');
    expect(wrapper.attributes('style')).toBeUndefined();

    const icon = wrapper.find('.v-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.props('size')).toBe(15);
    expect(icon.props('color')).toBe('subtext');

    const text = wrapper.find('span > span');
    expect(text.exists()).toBe(true);
    expect(text.attributes('style')).toEqual('font-size: 12px;');
  });

  it('icon with custom tag', () => {
    const wrapper = mount(TextInfo, {
      ...options,
      propsData: {
        icon: true,
        size: 12,
        tag: 'time',
        props: {
          datetime: '2020-10-29',
        },
      },
    });
    expect(wrapper.classes()).not.toContain('subtext--text');
    expect(wrapper.attributes('style')).toBeUndefined();

    const icon = wrapper.find('.v-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.props('size')).toBe(15);
    expect(icon.props('color')).toBe(undefined);

    const text = wrapper.find('span > time');
    expect(text.exists()).toBe(true);
    expect(text.attributes('style')).toEqual('font-size: 12px;');
    expect(text.attributes('datetime')).toEqual('2020-10-29');
  });

  it('text with size prop', () => {
    const wrapper = mount(TextInfo, {
      ...options,
      propsData: {
        size: 12,
      },
      slots: {
        default: 'foo',
      },
    });
    expect(wrapper.classes()).not.toContain('subtext--text');
    expect(wrapper.attributes('style')).toBe('font-size: 12px;');

    const icon = wrapper.find('.v-icon');
    expect(icon.exists()).toBe(false);

    expect(wrapper.text()).toBe('foo');
  });

  it('text without size prop', () => {
    const wrapper = mount(TextInfo, {
      ...options,
      slots: {
        default: 'foo',
      },
    });
    expect(wrapper.classes()).not.toContain('subtext--text');
    expect(wrapper.attributes('style')).toBeUndefined();

    const icon = wrapper.find('.v-icon');
    expect(icon.exists()).toBe(false);

    expect(wrapper.text()).toBe('foo');
  });
});
