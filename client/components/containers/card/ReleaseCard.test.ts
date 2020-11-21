import { mount, RouterLinkStub } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import ReleaseCard from './ReleaseCard.vue';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import Card from '~/components/parts/card/Card.vue';
import type { App } from '~~/types';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';

const artist = (i: number) => ({
  name: `artistName${i}`,
  id: `artistId${i}`,
  uri: `artistUri${i}`,
});
const baseItem = (i: number, type: 'album' | 'track') => ({
  releaseId: type === 'album' ? `id${i}` : `releaseId${i}`,
  id: `id${i}`,
  name: `name${i}`,
  uri: 'uri',
  artists: [artist(1)],
  images: [{
    url: 'path/to/image',
    height: 500,
    width: 500,
  }],
  externalUrls: {
    spotify: 'path/to/spotify',
  },
});
const album = (i: number): App.ReleaseCard<'album'> => ({
  ...baseItem(i, 'album'),
  type: 'album',
  releaseYear: '2020',
});
const track = (i: number): App.ReleaseCard<'track'> => ({
  ...baseItem(i, 'track'),
  type: 'track',
  externalUrls: {
    spotify: 'path/to/spotify',
  },
  linkedFrom: undefined,
});

const $getters = (set: boolean) => jest.fn().mockReturnValue({
  'playback/isContextSet': jest.fn().mockReturnValue(set),
  'playback/isTrackSet': jest.fn().mockReturnValue(set),
});
const $state = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $dispatch = jest.fn();

const factory = (type: 'album' | 'track', set: boolean, playing: boolean) => {
  return mount(ReleaseCard, {
    ...options,
    propsData: {
      item: type === 'album' ? album(1) : track(1),
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

describe('ReleaseCard', () => {
  it('album path', async () => {
    const wrapper = factory('album', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    const releaseTo = {
      path: '/releases/id1',
      query: undefined,
    };
    expect(wrapper.findAllComponents(RouterLinkStub).at(0).props().to).toEqual(releaseTo);
    expect(wrapper.findAllComponents(RouterLinkStub).at(1).props().to).toEqual(releaseTo);
    expect(wrapper.findAllComponents(RouterLinkStub).at(2).props().to).toBe('/artists/artistId1');
  });

  it('track path', async () => {
    const wrapper = factory('track', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    const releaseTo = {
      path: '/releases/releaseId1',
      query: {
        track: 'id1',
      },
    };
    expect(wrapper.findAllComponents(RouterLinkStub).at(0).props().to).toEqual(releaseTo);
    expect(wrapper.findAllComponents(RouterLinkStub).at(1).props().to).toEqual(releaseTo);
    expect(wrapper.findAllComponents(RouterLinkStub).at(2).props().to).toBe('/artists/artistId1');
  });

  it('when a release track is not set', async () => {
    const wrapper = factory('album', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when a track is not set', async () => {
    const wrapper = factory('track', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when a release track set', async () => {
    const wrapper = factory('album', true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when a track set', async () => {
    const wrapper = factory('track', true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-play-circle');
  });

  it('when playing a release track', async () => {
    const wrapper = factory('album', true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-pause-circle');
  });

  it('when playing a track', async () => {
    const wrapper = factory('track', true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    expect(wrapper.findComponent(ReleaseArtwork).props().icon).toBe('mdi-pause-circle');
  });

  it('play a release context', async () => {
    const wrapper = factory('album', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      contextUri: 'uri',
    });
  });

  it('play a track context', async () => {
    const wrapper = factory('track', false, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      trackUriList: ['uri'],
    });
  });

  it('resume a release track', async () => {
    const wrapper = factory('album', true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play');
  });

  it('resume a track', async () => {
    const wrapper = factory('track', true, false);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/play');
  });

  it('pause a release track', async () => {
    const wrapper = factory('album', true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });

  it('pause a track', async () => {
    const wrapper = factory('track', true, true);
    await wrapper.findComponent(Card).setData({
      isLoaded: true,
    });
    await wrapper.findComponent(ReleaseArtwork).vm.$emit(ON_MEDIA_BUTTON_CLICKED);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });
});
