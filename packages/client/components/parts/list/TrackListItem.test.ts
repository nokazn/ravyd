import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import TrackListItem from './TrackListItem.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import type { App } from '~/entities';

const CLICK = 'click';
const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const subtextClass = 'subtext--text';

const artist = (i: number) => ({
  name: `name${i}`,
  id: `id${i}`,
  uri: `uri${i}`,
});
const item = (isPlayable: boolean, featuredArtists: App.MinimumArtist[]): App.TrackDetail => ({
  type: 'track',
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
  columnType: 'single' | 'multi',
  featuredArtists: App.MinimumArtist[],
) => {
  return mount(TrackListItem, {
    ...options,
    propsData: {
      item: item(isPlayable, featuredArtists),
      set,
      playing,
    },
    mocks: {
      ...mocks,
      $screen: {
        isMultiColumn: columnType === 'multi',
        isSingleColumn: columnType === 'single',
      },
    },
  });
};

describe('TrackListItem', () => {
  it('from normal to active in pc', async () => {
    const wrapper = factory(false, false, true, 'multi', [artist(2)]);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    const nuxtLink = title.at(0);
    const span = title.at(1);
    const artistNames = title.at(2);
    expect(nuxtLink.classes()).not.toContain(activeClass);
    expect(span.classes()).toContain(subtextClass);
    expect(artistNames.classes()).toContain(subtextClass);

    // play a track
    await wrapper.setProps({
      set: true,
      playing: true,
    });
    expect(nuxtLink.classes()).toContain(activeClass);
    expect(span.classes()).toContain(activeClass);
    expect(artistNames.classes()).toContain(activeClass);
  });

  it('from normal to active in mobile', async () => {
    const wrapper = factory(false, false, true, 'multi', [artist(2)]);
    const title = wrapper.find('div.g-ellipsis-text > span');
    expect(title.classes()).not.toContain(activeClass);

    // play a track
    await wrapper.setProps({
      set: true,
      playing: true,
    });
    expect(title.classes()).toContain(activeClass);
  });

  it('disabled in pc', async () => {
    const wrapper = factory(false, false, false, 'multi', [artist(2)]);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(3);
    const nuxtLink = title.at(0);
    const span = title.at(1);
    const artistNames = title.at(2);
    expect(nuxtLink.classes()).toContain(inactiveClass);
    expect(span.classes()).toContain(inactiveClass);
    expect(artistNames.classes()).toContain(inactiveClass);
  });

  it('disabled in mobile', async () => {
    const wrapper = factory(false, false, false, 'multi', [artist(2)]);
    const title = wrapper.find('div.g-ellipsis-text > span');
    expect(title.classes()).toContain(inactiveClass);
  });

  it('no featured artists in pc', async () => {
    const wrapper = factory(false, false, true, 'multi', []);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(1);
    const nuxtLink = title.at(0);
    expect(nuxtLink.classes()).not.toContain(activeClass);

    // play a track
    await wrapper.setProps({
      set: true,
      playing: true,
    });
    expect(nuxtLink.classes()).toContain(activeClass);
  });

  it('click media button or item in pc', async () => {
    const wrapper = factory(false, false, true, 'multi', [artist(2)]);
    await wrapper.find('.v-list-item__content .v-btn').trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toBeTruthy();

    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[1]).toBeFalsy();
  });

  it('click media button or item in mobile', async () => {
    const wrapper = factory(false, false, true, 'single', [artist(2)]);
    expect(wrapper.find('.v-list-item__content .v-btn').exists()).toBe(false);

    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite button in pc', async () => {
    const wrapper = factory(false, false, true, 'multi', [artist(2)]);
    await wrapper.findComponent(FavoriteButton).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite button in mobile', async () => {
    const wrapper = factory(false, false, true, 'single', [artist(2)]);
    await wrapper.findComponent(FavoriteButton).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite menu item', async () => {
    const wrapper = factory(false, false, true, 'multi', [artist(2)]);
    await wrapper.findComponent(TrackMenu).vm.$emit(ON_FAVORITE_MENU_CLICKED);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });
});
