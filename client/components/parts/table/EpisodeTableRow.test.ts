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
const factory = (columnType: 'single' | 'multi', hideAddedAt: boolean = false) => {
  return mount(EpisodeTableRow, {
    ...options,
    propsData: {
      item,
      publisher: 'publisher',
      set: false,
      playing: false,
      hideAddedAt,
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
  it('mobile', () => {
    const wrapper = factory('single');
    expect(wrapper.findComponent(EpisodeTableRowMobile).exists()).toBe(true);
    expect(wrapper.findComponent(EpisodeTableRowPc).exists()).toBe(false);
  });

  it('pc', () => {
    const wrapper = factory('multi');
    expect(wrapper.findComponent(EpisodeTableRowPc).exists()).toBe(true);
    expect(wrapper.findComponent(EpisodeTableRowMobile).exists()).toBe(false);
  });

  it('emit when click item in mobile', async () => {
    const wrapper = factory('single');
    await wrapper.findComponent(EpisodeTableRowMobile).trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit when click item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(EpisodeTableRowPc).trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit when media button item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(EpisodeTableRowPc).vm.$emit(ON_MEDIA_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit when favorite button item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(EpisodeTableRowPc).vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });

  it.todo('active text color');
  it.todo('inactive text color');
  it.todo('hideAddedAt prop');
  it.todo('explicit item');
});
