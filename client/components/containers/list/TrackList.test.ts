import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import TrackList from './TrackList.vue';
import TrackListItem from '~/components/parts/list/TrackListItem.vue';
import type { App } from '~~/types';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const artist = (i: number) => ({
  id: `artistId${i}`,
  name: 'name',
  uri: `artistUri${i}`,
});
const item = (i: number): App.TrackDetail => ({
  type: 'track',
  id: `id${i}`,
  name: 'name',
  uri: `uri${i}`,
  artists: [artist(1)],
  durationMs: 100000,
  externalUrls: {
    spotify: 'path/to/spotify',
  },
  isSaved: true,
  releaseId: 'releaseId',
  releaseName: 'releaseName',
  images: [],
  linkedFrom: undefined,
  index: 1,
  trackNumber: 1,
  discNumber: 1,
  featuredArtists: [artist(2)],
  explicit: false,
  isPlayable: true,
  previewUrl: 'path/to/preview',
});

const $gettersMock = (set: boolean) => jest.fn().mockReturnValue({
  'playback/isTrackSet': jest.fn().mockReturnValue(set),
});
const $stateMock = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $dispatchMock = jest.fn();

const factory = (t: number, l: number | undefined, set: boolean, playing: boolean) => {
  return mount(TrackList, {
    ...options,
    propsData: {
      tracks: [...new Array(t)].map((_, i) => item(i + 1)),
      uri: 'contextUri',
      length: l,
    },
    mocks: {
      ...mocks,
      $getters: $gettersMock(set),
      $state: $stateMock(playing),
      $dispatch: $dispatchMock,
      $screen: {
        isMultiColumn: true,
        isSingleColumn: false,
      },
    },
  });
};

describe('TrackList', () => {
  it('3 / 6 items are visible', async () => {
    const wrapper = factory(6, 3, false, false);
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(false);
    expect(items.at(4).isVisible()).toBe(false);
    expect(items.at(5).isVisible()).toBe(false);
  });

  it('all items are visible', async () => {
    const wrapper = factory(6, undefined, false, false);
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(true);
    expect(items.at(4).isVisible()).toBe(true);
    expect(items.at(5).isVisible()).toBe(true);
  });

  it('all items are visible2', async () => {
    const wrapper = factory(6, 10, false, false);
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(true);
    expect(items.at(4).isVisible()).toBe(true);
    expect(items.at(5).isVisible()).toBe(true);
  });

  it('emit on a favorite button of 2nd item clicked', async () => {
    const wrapper = factory(6, 3, false, false);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_FAVORITE_BUTTON_CLICKED, item(2));
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item(2));
  });

  it('emit on a media button of 2nd item clicked when playing a track', async () => {
    const wrapper = factory(6, 3, true, true);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });

  it('emit on a media button of 2nd item clicked when not playing a track', async () => {
    const wrapper = factory(6, 3, false, false);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    const trackUriList = ['uri1', 'uri2', 'uri3', 'uri4', 'uri5', 'uri6'];
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      trackUriList,
      offset: { uri: 'uri2' },
    });
    expect($dispatchMock).toHaveBeenCalledWith('playback/setCustomContext', {
      trackUriList,
      contextUri: 'contextUri',
    });
  });
});
