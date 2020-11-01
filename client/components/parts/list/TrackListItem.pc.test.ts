import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TrackListItemPc from './TrackListItem.pc.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import type { App } from '~~/types';

const CLICK = 'click';
const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const artist = (i: number) => ({
  name: `name${i}`,
  id: `id${i}`,
  uri: `uri${i}`,
});
const item = (isPlayable: boolean, featuredArtists: App.MinimumArtist[]): App.TrackDetail => ({
  id: 'id',
  name: 'name',
  uri: 'uri',
  artists: [artist(1)],
  durationMs: 10000,
  externalUrls: { spotify: 'path/to/spotify' },
  isSaved: false,
  releaseId: 'releaseId',
  releaseName: 'releaseName',
  images: [],
  linkedFrom: undefined,
  index: 1,
  trackNumber: 9,
  discNumber: 1,
  featuredArtists,
  explicit: false,
  isPlayable,
  externalIds: undefined,
  previewUrl: 'path/to/previewUrl',
});

const factory = (
  set: boolean,
  playing: boolean,
  isPlayable: boolean,
  featuredArtists: App.MinimumArtist[],
) => {
  return mount(TrackListItemPc, {
    ...options,
    propsData: {
      item: item(isPlayable, featuredArtists),
      set,
      playing,
      artworkSrc: 'path/to/artwork',
      releasePath: 'path/to/release',
      titleColor: undefined,
      subtitleColor: 'subtext--text',
      buttonSize: 36,
    },
  });
};

describe('TrackListItemPc', () => {
  it('with featured artists', async () => {
    const wrapper = factory(false, false, true, [artist(2)]);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(3);
  });

  it('without featured artists', async () => {
    const wrapper = factory(false, false, true, []);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(1);
  });


  it('click media button or item in pc', async () => {
    const wrapper = factory(false, false, true, [artist(2)]);
    await wrapper.find('.v-list-item__content .v-btn').trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toBeTruthy();

    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[1]).toBeFalsy();
  });

  it('click favorite button in pc', async () => {
    const wrapper = factory(false, false, true, [artist(2)]);
    await wrapper.findComponent(FavoriteButton).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite menu item', async () => {
    const wrapper = factory(false, false, true, [artist(2)]);
    await wrapper.findComponent(TrackMenu).vm.$emit(ON_FAVORITE_MENU_CLICKED);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });
});
