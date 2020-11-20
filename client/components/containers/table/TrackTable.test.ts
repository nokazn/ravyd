import { mount } from '@vue/test-utils';
import { mocks, options } from '~/tests/mocks/mount';
import TrackTable from './TrackTable.vue';
import TrackTableRow from '~/components/parts/table/TrackTableRow.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import { App } from '~~/types';

const CLICK = 'click';

const textStartClass = 'text-start';
const textCenterClass = 'text-center';
const width = (p: number) => `width: ${p}px; min-width: ${p}px;`;

const artist = (i: number) => ({
  id: `id${i}`,
  name: 'name',
  uri: 'uri',
});
const item = (i: number): App.TrackDetail => ({
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
  linkedFrom: undefined,
  index: i,
  trackNumber: i,
  discNumber: 1,
  featuredArtists: [artist(2)],
  explicit: false,
  isPlayable: true,
  previewUrl: 'path/to/preview',
});
const $stateMock = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $gettersMock = (episodeId?: string) => jest.fn().mockReturnValue({
  'playback/isTrackSet': (id: string) => id === episodeId,
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

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
      $state: $stateMock(playing),
      $getters: $gettersMock(setId),
      $dispatch: $dispatchMock,
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

  it('call play request on media button clicked', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'multi');
    await wrapper.findAllComponents(CircleButton).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request on media button clicked', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'multi', 'id2', true);
    await wrapper.findAllComponents(CircleButton).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });

  it('call pause request on row clicked for mobile', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'single');
    await wrapper.findAllComponents(TrackTableRow).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request on row clicked for mobile', async () => {
    const wrapper = factory([item(1), item(2), item(3)], 'single', 'id2', true);
    await wrapper.findAllComponents(TrackTableRow).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });
});
