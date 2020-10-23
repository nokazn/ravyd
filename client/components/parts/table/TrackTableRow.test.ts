import { mount } from '@vue/test-utils';
import TrackTableRow from './TrackTableRow.vue';
import TrackTableRowMobile from '~/components/parts/table/TrackTableRow.mobile.vue';
import TrackTableRowPc from '~/components/parts/table/TrackTableRow.pc.vue';
import { options, mocks } from '~/tests/mocks/mount';
import { App } from '~~/types';

const CLICK = 'click';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const artist = (i: number) => ({
  id: `id${i}`,
  name: 'name',
  uri: 'uri',
});
const item: App.TrackDetail = {
  id: 'id',
  name: 'name',
  uri: 'uri',
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
};
const factory = (columnType: 'single' | 'multi') => {
  return mount(TrackTableRow, {
    ...options,
    propsData: {
      item,
      active: false,
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

describe('TrackTableRow', () => {
  it('mobile', () => {
    const wrapper = factory('single');
    expect(wrapper.findComponent(TrackTableRowMobile).exists()).toBe(true);
    expect(wrapper.findComponent(TrackTableRowPc).exists()).toBe(false);
  });

  it('pc', () => {
    const wrapper = factory('multi');
    expect(wrapper.findComponent(TrackTableRowPc).exists()).toBe(true);
    expect(wrapper.findComponent(TrackTableRowMobile).exists()).toBe(false);
  });

  it('emit on click item in mobile', async () => {
    const wrapper = factory('single');
    await wrapper.findComponent(TrackTableRowMobile).trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on click item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(TrackTableRowPc).trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on media button item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(TrackTableRowPc).vm.$emit(ON_MEDIA_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on favorite button item in pc', async () => {
    const wrapper = factory('multi');
    await wrapper.findComponent(TrackTableRowPc).vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });
});
