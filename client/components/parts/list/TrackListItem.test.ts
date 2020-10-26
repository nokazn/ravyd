import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import TrackListItem from './TrackListItem.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import type { App } from '~~/types';

const CLICK = 'click';
const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const subtextClass = 'subtext--text';
const artistMock = {
  name: 'name',
  id: 'id',
  uri: 'uri',
};
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
      item: {
        id: 'id',
        name: 'name',
        uri: 'uri',
        artists: [artistMock],
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
      },
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
  it('from normal to active', async () => {
    const wrapper = factory(false, false, true, 'multi', [artistMock]);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(3);
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

  it('disabled', async () => {
    const wrapper = factory(false, false, false, 'multi', [artistMock]);
    const title = wrapper.findAll('div.g-ellipsis-text > *');
    expect(title.length).toBe(3);
    const nuxtLink = title.at(0);
    const span = title.at(1);
    const artistNames = title.at(2);
    expect(nuxtLink.classes()).toContain(inactiveClass);
    expect(span.classes()).toContain(inactiveClass);
    expect(artistNames.classes()).toContain(inactiveClass);
  });

  it('no featured artists', async () => {
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

  it('some featured artists in mobile device', async () => {
    const wrapper = factory(false, false, true, 'single', [artistMock]);
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
    const wrapper = factory(false, false, true, 'multi', [artistMock]);
    await wrapper.find('.v-list-item__content .v-btn').trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toBeTruthy();

    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[1]).toBeFalsy();
  });

  it('click media button or item in mobile', async () => {
    const wrapper = factory(false, false, true, 'single', [artistMock]);
    expect(wrapper.find('.v-list-item__content .v-btn').exists()).toBe(false);

    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite button in pc', async () => {
    const wrapper = factory(false, false, true, 'multi', [artistMock]);
    await wrapper.findComponent(FavoriteButton).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite button in mobile', async () => {
    const wrapper = factory(false, false, true, 'single', [artistMock]);
    await wrapper.findComponent(FavoriteButton).trigger(CLICK);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });

  it('click favorite menu item', async () => {
    const wrapper = factory(false, false, true, 'multi', [artistMock]);
    // @todo
    await wrapper.findComponent(TrackMenu).vm.$emit(ON_FAVORITE_MENU_CLICKED);
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toBeTruthy();
  });
});
