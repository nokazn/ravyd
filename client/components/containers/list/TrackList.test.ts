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
  releaseId: `releaseId${i}`,
  releaseName: `releaseName${i}`,
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

const $getters = (set: boolean) => () => ({
  'playback/isTrackSet': jest.fn().mockReturnValue(set),
});
const $state = (isPlaying: boolean) => () => ({
  playback: {
    isPlaying,
  },
});
const $dispatch = jest.fn();

const factory = (
  t: number,
  l: number | undefined,
  column: 'single' | 'multi',
  set: boolean = false,
  playing: boolean = false,
) => {
  return mount(TrackList, {
    ...options,
    propsData: {
      tracks: [...new Array(t)].map((_, i) => item(i + 1)),
      uri: 'contextUri',
      length: l,
    },
    mocks: {
      ...mocks,
      $getters: $getters(set),
      $state: $state(playing),
      $dispatch,
      $screen: {
        isMultiColumn: column === 'multi',
        isSingleColumn: column === 'single',
      },
    },
  });
};

describe('TrackList', () => {
  it('3 / 6 items are visible', async () => {
    const wrapper = factory(6, 3, 'multi');
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(false);
    expect(items.at(4).isVisible()).toBe(false);
    expect(items.at(5).isVisible()).toBe(false);
  });

  it('all items are visible', async () => {
    const wrapper = factory(6, undefined, 'multi');
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(true);
    expect(items.at(4).isVisible()).toBe(true);
    expect(items.at(5).isVisible()).toBe(true);
  });

  it('all items are visible2', async () => {
    const wrapper = factory(6, 10, 'multi');
    const items = wrapper.findAllComponents(TrackListItem);
    expect(items.at(0).isVisible()).toBe(true);
    expect(items.at(1).isVisible()).toBe(true);
    expect(items.at(2).isVisible()).toBe(true);
    expect(items.at(3).isVisible()).toBe(true);
    expect(items.at(4).isVisible()).toBe(true);
    expect(items.at(5).isVisible()).toBe(true);
  });

  it('call resuming when 2nd media button is clicked for mobile', async () => {
    const wrapper = factory(6, 3, 'single', true, false);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    expect($dispatch).toHaveBeenCalledWith('playback/play');
    // setCustomContext は呼ばれない
    expect($dispatch).toBeCalledTimes(1);
  });


  it('call playing request when 2nd media button is clicked for mobile', async () => {
    const wrapper = factory(6, 3, 'single');
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    const trackUriList = ['uri1', 'uri2', 'uri3', 'uri4', 'uri5', 'uri6'];
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      trackUriList,
      offset: { uri: 'uri2' },
    });
    expect($dispatch).toHaveBeenCalledWith('playback/setCustomContext', {
      trackUriList,
      contextUri: 'contextUri',
    });
    expect($dispatch).toBeCalledTimes(2);
  });

  it('call pausing request when 2nd media button is clicked for mobile', async () => {
    const wrapper = factory(6, 3, 'single', true, true);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
    expect($dispatch).toBeCalledTimes(1);
  });

  it('call resuming when 2nd media button is clicked', async () => {
    const wrapper = factory(6, 3, 'multi', true, false);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    expect($dispatch).toHaveBeenCalledWith('playback/play');
    // setCustomContext は呼ばれない
    expect($dispatch).toBeCalledTimes(1);
  });

  it('call playing request when 2nd media button is clicked', async () => {
    const wrapper = factory(6, 3, 'multi');
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    const trackUriList = ['uri1', 'uri2', 'uri3', 'uri4', 'uri5', 'uri6'];
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      trackUriList,
      offset: { uri: 'uri2' },
    });
    expect($dispatch).toHaveBeenCalledWith('playback/setCustomContext', {
      trackUriList,
      contextUri: 'contextUri',
    });
    expect($dispatch).toBeCalledTimes(2);
  });

  it('call pausing request when 2nd media button is clicked', async () => {
    const wrapper = factory(6, 3, 'multi', true, true);
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_MEDIA_BUTTON_CLICKED, item(2));
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
    expect($dispatch).toBeCalledTimes(1);
  });

  it('emit when 2nd favorite button is clicked for mobile', async () => {
    const wrapper = factory(6, 3, 'single');
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_FAVORITE_BUTTON_CLICKED, item(2));
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item(2));
  });

  it('emit when 2nd favorite button is clicked', async () => {
    const wrapper = factory(6, 3, 'multi');
    await wrapper
      .findAllComponents(TrackListItem)
      .at(1)
      .vm
      .$emit(ON_FAVORITE_BUTTON_CLICKED, item(2));
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item(2));
  });
});
