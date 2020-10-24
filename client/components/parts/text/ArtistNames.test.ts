import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ArtistNames from './ArtistNames.vue';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import type { SpotifyAPI } from '~~/types';

const id = (i: number) => `id${i}`;
const name = (i: number) => `name${i}`;
const artist = (i: number, hasImages: boolean): SpotifyAPI.Artist => ({
  external_urls: {
    spotify: 'path/to/spotify',
  },
  href: 'href',
  name: name(i),
  type: 'artist',
  uri: 'uri',
  id: id(i),
  followers: {
    href: 'path/to/follwers',
    total: 10000,
  },
  genres: ['rock', 'indie rock'],
  images: hasImages ? [{
    url: 'path/to/image',
    height: 500,
    width: 500,
  }] : [],
  popularity: 100,
});

describe('ArtistNames', () => {
  it('one artist with avatar', () => {
    const wrapper = mount(ArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1, true)],
        avatar: true,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(true);
    expect(wrapper.find('span > .v-icon').exists()).toBe(false);
  });

  it('one artist without images', () => {
    const wrapper = mount(ArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1, false)],
        avatar: true,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(false);
    expect(wrapper.find('span > .v-icon').exists()).toBe(false);
  });

  it('multiple artists with avatar', () => {
    const wrapper = mount(ArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1, true), artist(2, false), artist(3, true)],
        avatar: true,
      },
    });
    const artists = wrapper.findAll('div > span');
    expect(artists.at(0).find('.Artist__avatar').exists()).toBe(true);
    expect(artists.at(0).find('.v-icon.Artist__avatar').exists()).toBe(false);
    expect(artists.at(0).find('span > *:nth-child(2)').text()).toBe(name(1));

    // show default icon
    expect(artists.at(1).find('.Artist__avatar').exists()).toBe(true);
    expect(artists.at(1).find('.v-icon.Artist__avatar').exists()).toBe(true);
    expect(artists.at(1).find('span > *:nth-child(2)').text()).toBe(name(2));

    expect(artists.at(2).find('.Artist__avatar').exists()).toBe(true);
    expect(artists.at(2).find('.v-icon.Artist__avatar').exists()).toBe(false);
    expect(artists.at(2).find('span > *:nth-child(2)').text()).toBe(name(3));
  });

  it('no avatar', () => {
    const wrapper = mount(ArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1, true), artist(2, false), artist(3, true)],
        avatar: false,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(false);
  });

  it('text mode', () => {
    const wrapper = mount(ArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1, true), artist(2, false), artist(3, true)],
        // has priority for text prop
        avatar: true,
        text: true,
      },
    });
    expect(wrapper.findComponent(UserAvatar).exists()).toBe(false);
    expect(wrapper.find('div > span').text()).toBe(`${name(1)}, ${name(2)}, ${name(3)}`);
  });
});
