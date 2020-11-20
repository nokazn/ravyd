import { mount } from '@vue/test-utils';
import { mocks, options } from '~/tests/mocks/mount';
import PlaylistTrackTable from './PlaylistTrackTable.vue';
import PlaylistTrackTableRow from '~/components/parts/table/PlaylistTrackTableRow.vue';
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import { App } from '~~/types';

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
const item = (i: number): App.PlaylistTrackDetail => ({
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
  addedAt: {
    origin: '2020/1/1 0:00',
    text: '2020/1/1',
    title: '2020-01-01',
  },
});
const $stateMock = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $gettersMock = (trackId?: string) => jest.fn().mockReturnValue({
  'playback/isTrackSet': (id: string) => id === trackId,
  'playback/isContextSet': () => trackId != null,
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  {
    tracks,
    playlistId,
    noDataText,
    custom,
    collaborative,
    hideAddedAt,
    emptyUri = false,
  }: {
    tracks: App.TrackDetail[];
    playlistId?: string;
    noDataText?: string;
    custom?: boolean;
    collaborative?: boolean;
    hideAddedAt?: boolean;
    emptyUri?: boolean;
  },
  column: 'single' | 'multi',
  setId?: string,
  playing: boolean = false,
) => {
  return mount(PlaylistTrackTable, {
    ...options,
    propsData: {
      tracks,
      playlistId,
      uri: emptyUri ? undefined : 'contextUri',
      noDataText,
      custom,
      collaborative,
      hideAddedAt,
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

describe('PlaylistTrackTable', () => {
  it('headers for single column', () => {
    const wrapper = factory({
      tracks: [item(1), item(2)],
    }, 'single');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(3);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(48 + 12));
    expect(th.at(1).classes()).toContain(textStartClass);
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(32 * 2 + 2 + 12));
  });

  it('headers for multi column with added-at & collaborative column', () => {
    const wrapper = factory({
      tracks: [item(1), item(2)],
      collaborative: true,
    }, 'multi');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(8);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(48 + 12));
    expect(th.at(1).classes()).toContain(textCenterClass);
    expect(th.at(1).attributes().style).toBe(width(36 + 12));
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(36 + 12));
    expect(th.at(3).classes()).toContain(textStartClass);
    expect(th.at(4).classes()).toContain(textCenterClass);
    expect(th.at(4).attributes().style).toBe(width(96));
    expect(th.at(5).classes()).toContain(textCenterClass);
    expect(th.at(5).attributes().style).toBe(width(72));
    expect(th.at(6).classes()).toContain(textCenterClass);
    expect(th.at(6).attributes().style).toBe(width(72));
    expect(th.at(7).classes()).toContain(textCenterClass);
    expect(th.at(7).attributes().style).toBe(width(36 + 12));
  });

  it('headers for multi column without added-at & collaborative column', () => {
    const wrapper = factory({
      tracks: [item(1), item(2)],
      hideAddedAt: true,
    }, 'multi');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(6);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(48 + 12));
    expect(th.at(1).classes()).toContain(textCenterClass);
    expect(th.at(1).attributes().style).toBe(width(36 + 12));
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(36 + 12));
    expect(th.at(3).classes()).toContain(textStartClass);
    expect(th.at(4).classes()).toContain(textCenterClass);
    expect(th.at(4).attributes().style).toBe(width(72));
    expect(th.at(5).classes()).toContain(textCenterClass);
    expect(th.at(5).attributes().style).toBe(width(36 + 12));
  });

  it('call play request on row clicked for mobile', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'single');
    await wrapper.findAllComponents(PlaylistTrackTableRow).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call play request on row clicked without uri prop for mobile', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
      emptyUri: true,
    }, 'single');
    await wrapper.findAllComponents(PlaylistTrackTableRow).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      trackUriList: ['uri1', 'uri2', 'uri3'],
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request on row clicked for mobile', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'single', 'id2', true);
    await wrapper.findAllComponents(PlaylistTrackTableRow).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });

  it('call play request on media button clicked', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'multi');
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      contextUri: 'contextUri',
      offset: { uri: 'uri2' },
    });
  });

  it('call play request on media button clicked with custom prop', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
      custom: true,
    }, 'multi');
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play', {
      trackUriList: ['uri1', 'uri2', 'uri3'],
      offset: { uri: 'uri2' },
    });
  });

  it('call pause request on media button clicked', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'multi', 'id2', true);
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });

  it('emit on favorite button clicked for mobile', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'single', 'id2', true);
    await wrapper.findAllComponents(FavoriteButton).at(1).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0]).toBeTruthy();
  });

  it('emit on favorite button clicked for pc', async () => {
    const wrapper = factory({
      tracks: [item(1), item(2), item(3)],
    }, 'multi', 'id2', true);
    await wrapper.findAllComponents(FavoriteButton).at(1).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0]).toBeTruthy();
  });
});
