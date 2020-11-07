import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import UserName from './UserName.vue';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import type { SpotifyAPI } from '~~/types';

const userName = (i: number) => `display_name${i}`;
const id = (i: number) => `id${i}`;
const image: SpotifyAPI.Image = {
  url: 'path/to/image',
  height: 500,
  width: 500,
};
const user = (
  i: number,
  hasDisplayName: boolean,
  images: SpotifyAPI.Image[],
): SpotifyAPI.UserData => ({
  country: 'JP',
  display_name: hasDisplayName ? userName(i) : null,
  email: 'user@email.com',
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  external_urls: {
    spotify: 'path/to/spotify',
  },
  followers: {
    href: 'path/to/followers',
    total: 10,
  },
  href: 'href',
  id: id(i),
  images,
  product: 'premium',
  type: 'user',
  uri: 'uri',
});

describe('UserName', () => {
  it('invisible avatar when no images are valid', () => {
    const wrapper = mount(UserName, {
      ...options,
      propsData: {
        user: user(1, true, []),
        avatar: true,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(false);
  });

  it('invisible avatar despite images are valid', () => {
    const wrapper = mount(UserName, {
      ...options,
      propsData: {
        user: user(1, true, [image]),
        avatar: false,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(false);
  });

  it('modify user name to undefined', async () => {
    const wrapper = mount(UserName, {
      ...options,
      propsData: {
        user: user(1, true, []),
      },
    });
    const link = wrapper.find('div > *:last-child');
    expect(link.text()).toBe(userName(1));

    await wrapper.setProps({
      user: user(1, false, []),
    });
    expect(link.text()).toBe(id(1));
  });
});
