import { mount } from '@vue/test-utils';
import EpisodeTableRow from './EpisodeTableRow.vue';
import EpisodeTableRowMobile from '~/components/parts/table/EpisodeTableRow.mobile.vue';
import EpisodeTableRowPc from '~/components/parts/table/EpisodeTableRow.pc.vue';
import { options, mocks } from '~/tests/mocks/mount';
import { App } from '~~/types';

const CLICK = 'click';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const item: App.EpisodeDetail = {
  index: 1,
  id: 'id',
  name: 'name',
  uri: 'uri',
  description: 'description',
  images: [],
  isPlayable: true,
  explicit: false,
  releaseDate: '2020',
  releaseDatePrecision: 'year',
  durationMs: 100000,
  resumePoint: {
    fully_played: false,
    resume_position_ms: 0,
  },
  externalUrls: {
    spotify: 'path/to/spotify',
  },
  previewUrl: 'path/to/preview',
  showId: 'showId',
  showName: 'showName',
};
const factory = (columnType: 'single' | 'multi') => {
  return mount(EpisodeTableRow, {
    ...options,
    propsData: {
      item,
      publisher: 'publisher',
      set: false,
      playing: false,
    },
    mocks: {
      ...mocks,
      $screen: {
        isSingleColumn: columnType === 'single',
        isMultiColumn: columnType === 'multi',
      },
    },
  });
};

describe('EpisodeTableRow', () => {
  it('emit on click item in mobile', async () => {
    const wrapper = factory('single');
    const row = wrapper.findComponent(EpisodeTableRowMobile);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on click item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(EpisodeTableRowPc);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on media button item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(EpisodeTableRowPc);
    expect(row.exists()).toBe(true);
    await row.vm.$emit(ON_MEDIA_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on favorite button item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(EpisodeTableRowPc);
    expect(row.exists()).toBe(true);
    await row.vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });
});
