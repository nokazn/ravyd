import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import PlaylistCard from './PlaylistCard.vue';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import Card from '~/components/parts/card/Card.vue';
import type { SpotifyAPI } from '~~/types';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';

const item = (i: number): SpotifyAPI.SimplePlaylist => ({
  collaborative: false,
  description: 'description',
  external_urls: {
    spotify: 'path/to/spotify',
  },
  href: 'href',
  id: `id${i}`,
  images: [{
    url: 'path/to/image',
    height: 500,
    width: 500,
  }],
  name: `name${i}`,
  owner: {
    country: 'JP',
    display_name: 'display_name',
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
    id: 'userId',
    images: [],
    product: 'premium',
    type: 'user',
    uri: 'uri',
  },
  public: true,
  snapshot_id: 'snapshot_id',
  tracks: {
    href: 'path/to/tracks',
    total: 100,
  },
  type: 'playlist',
  uri: `uri${i}`,
});

const $getters = (set: boolean) => () => ({
  'playback/isContextSet': jest.fn().mockReturnValue(set),
});
const $state = (isPlaying: boolean) => () => ({
  playback: {
    isPlaying,
  },
});
const $dispatch = jest.fn();

const factory = (set: boolean, playing: boolean) => {
  return mount(PlaylistCard, {
    ...options,
    propsData: {
      item: item(1),
    },
    mocks: {
      ...mocks,
      $getters: $getters(set),
      $state: $state(playing),
      $dispatch,
      $screen: {
        isMultiColumn: true,
        isSingleColumn: false,
      },
    },
  });
};

describe('PlaylistCard', () => {
  it('playlist path', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(Card).props().to).toBe('/playlists/id1');
  });

  it('when a playlist track is not set', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when a playlist track set', async () => {
    const wrapper = factory(true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when playing a playlist track', async () => {
    const wrapper = factory(true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-pause-circle');
  });

  it('play a playlist context', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      contextUri: 'uri1',
    });
  });

  it('resume a track', async () => {
    const wrapper = factory(true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play');
  });

  it('pause a track', async () => {
    const wrapper = factory(true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });
});
