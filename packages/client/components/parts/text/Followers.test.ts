import { mount } from '@vue/test-utils';
import type { SpotifyAPI } from 'shared/types';
import { options } from '~/tests/mocks/mount';
import Followers from './Followers.vue';
import TextInfo from '~/components/parts/text/TextInfo.vue';

const followers = (total: number): SpotifyAPI.Followers => ({
  total,
  href: 'path/to/followers',
});

describe('Followers', () => {
  it('icon', () => {
    const wrapper = mount(Followers, {
      ...options,
      propsData: {
        followers: followers(1000),
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
    expect(text.attributes('title')).toBe('フォロワー 1,000人');
    expect(text.text()).toBe('フォロワー 1,000人');
    expect(wrapper.find('.v-icon').exists()).toBe(true);
  });

  it('text', () => {
    const wrapper = mount(Followers, {
      ...options,
      propsData: {
        followers: followers(1000),
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
    expect(text.attributes('title')).toBe('フォロワー 1,000人');
    expect(text.text()).toBe('フォロワー 1,000人');
    expect(wrapper.find('.v-icon').exists()).toBe(false);
  });
});
