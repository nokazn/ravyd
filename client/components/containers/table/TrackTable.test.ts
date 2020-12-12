import { mount } from '@vue/test-utils';
import { mocks, options } from '~/tests/mocks/mount';
import TrackTable from './TrackTable.vue';
import TrackTableRow from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { App, SpotifyAPI } from '~~/types';

const CLICK = 'click';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const textStartClass = 'text-start';
const textCenterClass = 'text-center';
const width = (p: number) => `width: ${p}px; min-width: ${p}px;`;

const artist = (i: number) => ({
  id: `id${i}`,
  name: 'name',
  uri: 'uri',
});
const linkedTrack = (i: number): SpotifyAPI.LinkedTrack => ({
  external_urls: {
    spotify: 'path/to/spotify',
  },
  href: 'path/to/track',
  id: `id${i}`,
  type: 'track',
  uri: `uri${i}`,
});
const item = (
  i: number,
  discNumber: number = 1,
  linkedFrom?: SpotifyAPI.LinkedTrack,
): App.TrackDetail => ({
  type: 'track',
  id: `id${i}`,
  name: `name${i}`,
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
  linkedFrom,
  index: i,
  trackNumber: i,
  discNumber,
  featuredArtists: [artist(2)],
  explicit: false,
  isPlayable: true,
  previewUrl: 'path/to/preview',
});
const $state = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $getters = (trackId?: string) => jest.fn().mockReturnValue({
  'playback/isTrackSet': (id: string) => id === trackId,
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (
  items: App.TrackDetail[],
  column: 'single' | 'multi',
  setId?: string,
  playing: boolean = false,
) => {
  return mount(TrackTable, {
    ...options,
    propsData: {
      tracks: items,
      uri: 'contextUri',
    },
    mocks: {
      ...mocks,
      $state: $state(playing),
      $getters: $getters(setId),
      $dispatch,
      $screen: {
        isSingleColumn: column === 'single',
        isMultiColumn: column === 'multi',
      },
    },
  });
};

describe('TrackTable', () => {
  it('headers for single column', () => {
    const wrapper = factory([item(1), item(2)], 'single');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(2);
    expect(th.at(0).classes()).toContain(textStartClass);
    expect(th.at(1).classes()).toContain(textCenterClass);
    expect(th.at(1).attributes().style).toBe(width(32 * 2 + 2 + 12));
  });

  it('headers for multi column with added-at column', () => {
    const wrapper = factory([item(1), item(2)], 'multi');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(5);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(48));
    expect(th.at(1).classes()).toContain(textCenterClass);
    expect(th.at(1).attributes().style).toBe(width(36 + 12));
    expect(th.at(2).classes()).toContain(textStartClass);
    expect(th.at(3).classes()).toContain(textCenterClass);
    expect(th.at(3).attributes().style).toBe(width(72));
    expect(th.at(4).classes()).toContain(textCenterClass);
    expect(th.at(4).attributes().style).toBe(width(36 + 12));
  });

  it("hide group of single set track's disc number", () => {
    const wrapper = factory([
      item(1, 1),
      item(2, 1),
      item(3, 1),
      item(4, 1),
      item(5, 1),
      item(6, 1),
    ], 'multi');
    expect(wrapper.findComponent(TrackTableGroupHeader).exists()).toBe(false);
  });

  it('show group of disc number', () => {
    const wrapper = factory([
      item(1, 1),
      item(2, 1),
      item(3, 1),
      item(4, 2),
      item(5, 2),
      item(6, 2),
    ], 'multi');
    expect(wrapper.findComponent(TrackTableGroupHeader).exists()).toBe(true);
  });

  it("show group of relinked track's incremental disc number", () => {
    const wrapper = factory([
      item(1, 1, linkedTrack(1)),
      item(2, 1, linkedTrack(2)),
      item(3, 1, linkedTrack(3)),
      item(4, 2, linkedTrack(4)),
      item(5, 2, linkedTrack(5)),
      item(6, 2, linkedTrack(6)),
    ], 'multi');
    expect(wrapper.findComponent(TrackTableGroupHeader).exists()).toBe(true);
  });

  it("hide group of relinked track's non-incremental disc number", () => {
    const wrapper = factory([
      item(1, 1),
      item(2, 1),
      item(3, 2, linkedTrack(3)),
      item(4, 4, linkedTrack(4)),
      item(5, 2, linkedTrack(5)),
      item(6, 1, linkedTrack(6)),
    ], 'multi');
    expect(wrapper.findComponent(TrackTableGroupHeader).exists()).toBe(false);
  });

  it('call play request when row clicked for mobile', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'single');
    await wrapper.findAllComponents(TrackTableRow).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request when row clicked for mobile', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'single', 'id2', true);
    await wrapper.findAllComponents(TrackTableRow).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });

  it('call play request when media button clicked', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'multi');
    await wrapper.findAllComponents(CircleButton).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request when media button clicked', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'multi', 'id2', true);
    await wrapper.findAllComponents(CircleButton).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });

  it('emit when favorite button clicked for mobile', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'single', 'id2', true);
    await wrapper.findAllComponents(FavoriteButton).at(1).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0]).toBeTruthy();
  });

  it('emit when favorite button clicked for pc', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'multi', 'id2', true);
    await wrapper.findAllComponents(FavoriteButton).at(1).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0]).toBeTruthy();
  });
});
