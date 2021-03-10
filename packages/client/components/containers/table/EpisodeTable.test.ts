import { mount } from '@vue/test-utils';
import { mocks, options } from '~/tests/mocks/mount';
import EpisodeTable from './EpisodeTable.vue';
import EpisodeTableRow from '~/components/parts/table/EpisodeTableRow.vue';
import PlaylistMediaButton from '~/components/parts/button/PlaylistMediaButton.vue';
import type { App } from '~/entities';

const CLICK = 'click';

const textStartClass = 'text-start';
const textCenterClass = 'text-center';
const width = (p: number) => `width: ${p}px; min-width: ${p}px;`;

const item = (i: number, resumePoint?: [boolean, number]): App.EpisodeDetail => ({
  index: i,
  id: `id${i}`,
  name: `name${i}`,
  uri: `uri${i}`,
  description: 'description',
  images: [],
  isPlayable: true,
  explicit: false,
  releaseDate: '2020',
  releaseDatePrecision: 'year',
  durationMs: 100 * 60 * 1000,
  resumePoint: {
    fully_played: resumePoint?.[0] ?? false,
    resume_position_ms: resumePoint?.[1] ?? 0,
  },
  externalUrls: {
    spotify: 'path/to/spotify',
  },
  previewUrl: 'path/to/preview',
  showId: `showId${i}`,
  showName: `showName${i}`,
});

const $state = (isPlaying: boolean) => () => ({
  playback: {
    isPlaying,
  },
});
const $getters = (set: boolean) => () => ({
  'playback/isTrackSet': jest.fn().mockReturnValue(set),
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = ({ episodes, noDataText, hideAddedAt = false }: {
  episodes: App.EpisodeDetail[];
  noDataText?: string;
  hideAddedAt?: boolean;
}, column: 'single' | 'multi', set: boolean = false, playing: boolean = false) => {
  return mount(EpisodeTable, {
    ...options,
    propsData: {
      episodes,
      uri: 'contextUri',
      publisher: 'publisher',
      noDataText,
      hideAddedAt,
    },
    mocks: {
      ...mocks,
      $state: $state(playing),
      $getters: $getters(set),
      $dispatch,
      $screen: {
        isSingleColumn: column === 'single',
        isMultiColumn: column === 'multi',
      },
    },
  });
};

describe('EpisodeTable', () => {
  it('headers for single column', () => {
    const wrapper = factory({ episodes: [item(1), item(2)] }, 'single');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(3);
    expect(th.at(0).classes()).toContain(textStartClass);
    expect(th.at(1).classes()).toContain(textCenterClass);
    expect(th.at(1).attributes().style).toBe(width(44 + 12));
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(32 + 12));
  });

  it('headers for multi column with added-at column', () => {
    const wrapper = factory({ episodes: [item(1), item(2)] }, 'multi');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(6);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(36 + 12 + 8));
    expect(th.at(1).classes()).toContain(textStartClass);
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(56 + 12 + 8));
    expect(th.at(3).classes()).toContain(textCenterClass);
    expect(th.at(3).attributes().style).toBe(width(72));
    expect(th.at(4).classes()).toContain(textCenterClass);
    expect(th.at(4).attributes().style).toBe(width(60));
    expect(th.at(5).classes()).toContain(textCenterClass);
    expect(th.at(5).attributes().style).toBe(width(36 + 12));
  });

  it('headers for multi column without added-at column', () => {
    const wrapper = factory({
      episodes: [item(1), item(2)],
      hideAddedAt: true,
    }, 'multi');
    const th = wrapper.findAll('thead > tr > th');
    expect(th.length).toBe(5);
    expect(th.at(0).classes()).toContain(textCenterClass);
    expect(th.at(0).attributes().style).toBe(width(36 + 12 + 8));
    expect(th.at(1).classes()).toContain(textStartClass);
    expect(th.at(2).classes()).toContain(textCenterClass);
    expect(th.at(2).attributes().style).toBe(width(56 + 12 + 8));
    expect(th.at(3).classes()).toContain(textCenterClass);
    expect(th.at(3).attributes().style).toBe(width(60));
    expect(th.at(4).classes()).toContain(textCenterClass);
    expect(th.at(4).attributes().style).toBe(width(36 + 12));
  });

  it('select unplayed from all', async () => {
    const wrapper = factory({
      episodes: [
        item(1),
        item(2, [true, 10 * 60 * 1000]),
        item(3, [false, 10 * 60 * 1000]),
        item(4, [true, 0]),
      ],
    }, 'multi');
    await wrapper.setData(({
      select: 'unplayed',
    }));
    expect(wrapper.findAll('tbody > tr').length).toBe(1);
    expect(wrapper.find('tbody > tr > td:nth-child(2) > div > div > div.g-ellipsis-text > a').text()).toBe('name1');
  });

  it('select inProgress from all', async () => {
    const wrapper = factory({
      episodes: [
        item(1),
        item(2, [true, 10 * 60 * 1000]),
        item(3, [false, 10 * 60 * 1000]),
        item(4, [true, 0]),
      ],
    }, 'multi');
    await wrapper.setData(({
      select: 'inProgress',
    }));
    expect(wrapper.findAll('tbody > tr').length).toBe(1);
    expect(wrapper.find('tbody > tr > td:nth-child(2) > div > div > div.g-ellipsis-text > a').text()).toBe('name3');
  });

  it('call resuming request when 2nd row clicked for mobile', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'single', true, false);
    await wrapper.findAllComponents(EpisodeTableRow).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play');
  });

  it('call playing request when 2nd row clicked for mobile', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'single');
    await wrapper.findAllComponents(EpisodeTableRow).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      context: 'contextUri',
      track: item(2),
    });
  });

  it('call pausing request when 2nd row clicked for mobile', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'single', true, true);
    await wrapper.findAllComponents(EpisodeTableRow).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });

  it('call resuming request when 2nd media button clicked', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'multi', true, false);
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play');
  });

  it('call playing request when 2nd media button clicked', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'multi');
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/play', {
      context: 'contextUri',
      track: item(2),
    });
  });

  it('call pausing request when 2nd media button clicked', async () => {
    const wrapper = factory({
      episodes: [item(1), item(2), item(3)],
    }, 'multi', true, true);
    await wrapper.findAllComponents(PlaylistMediaButton).at(1).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/pause');
  });
});
