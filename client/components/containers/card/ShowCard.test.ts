import { mount } from '@vue/test-utils';
import type { SpotifyAPI } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import ShowCard from './ShowCard.vue';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import Card from '~/components/parts/card/Card.vue';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';

const item = (i: number): SpotifyAPI.SimpleShow => ({
  available_markets: ['JP'],
  copyrights: [{
    type: 'C',
    text: 'copyright',
  }],
  description: 'description',
  explicit: false,
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
  is_externally_hosted: false,
  languages: ['JP'],
  media_type: 'audio',
  name: `name${i}`,
  publisher: 'publisher',
  type: 'show',
  total_episodes: 10,
  uri: 'uri',
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
  return mount(ShowCard, {
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

describe('ShowCard', () => {
  it('playlist path', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(Card).props().to).toBe('/shows/id1');
  });

  it('when a show track is not set', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when a show track is set', async () => {
    const wrapper = factory(true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when playing a show track', async () => {
    const wrapper = factory(true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-pause-circle');
  });

  it('play a show context', async () => {
    const wrapper = factory(false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      contextUri: 'uri',
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
