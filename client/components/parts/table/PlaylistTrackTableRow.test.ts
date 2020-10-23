import { mount } from '@vue/test-utils';
import PlaylistTrackTableRow from './PlaylistTrackTableRow.vue';
import PlaylistTrackTableRowMobile from '~/components/parts/table/PlaylistTrackTableRow.mobile.vue';
import PlaylistTrackTableRowPc from '~/components/parts/table/PlaylistTrackTableRow.pc.vue';
import { options, mocks } from '~/tests/mocks/mount';
import { App } from '~~/types';

const CLICK = 'click';

const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const artist = {
  id: 'id',
  name: 'name',
  uri: 'uri',
};
const item: App.PlaylistTrackDetail = {
  id: 'id',
  name: 'name',
  uri: 'uri',
  artists: [artist],
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
  featuredArtists: [],
  explicit: false,
  isPlayable: true,
  previewUrl: 'path/to/preview',
  type: 'track',
};
const factory = (columnType: 'single' | 'multi') => {
  return mount(PlaylistTrackTableRow, {
    ...options,
    propsData: {
      item,
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

describe('PlaylistTrackTableRow', () => {
  it('emit on click item in mobile', async () => {
    const wrapper = factory('single');
    const row = wrapper.findComponent(PlaylistTrackTableRowMobile);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on click item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(PlaylistTrackTableRowPc);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on media button item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(PlaylistTrackTableRowPc);
    expect(row.exists()).toBe(true);
    await row.vm.$emit(ON_MEDIA_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });

  it('emit on favorite button item in pc', async () => {
    const wrapper = factory('multi');
    const row = wrapper.findComponent(PlaylistTrackTableRowPc);
    expect(row.exists()).toBe(true);
    await row.vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item);
  });
});
