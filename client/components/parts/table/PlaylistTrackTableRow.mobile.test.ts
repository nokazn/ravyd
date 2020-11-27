import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import PlaylistTrackTableRowMobile from './PlaylistTrackTableRow.mobile.vue';
import TrackMenu from '~/components/containers/menu/TrackMenu.vue';
import EpisodeMenu from '~/components/containers/menu/EpisodeMenu.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

const CLICK = 'click';
const ON_ROW_CLICKED = 'on-row-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const subtextClass = 'subtext--text';
const artist = (i: number) => ({
  id: `id${i}`,
  name: 'name',
  uri: 'uri',
});
const item = (isPlayable: boolean, type: 'track' | 'episode'): App.PlaylistTrackDetail => ({
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
  isPlayable,
  previewUrl: 'path/to/preview',
  type,
});

const factory = (set: boolean, playing: boolean, isPlayable: boolean, type: 'track' | 'episode') => {
  return mount(PlaylistTrackTableRowMobile, {
    ...options,
    propsData: {
      item: item(isPlayable, type),
      set,
      playing,
      disabled: isPlayable,
      artworkSrc: 'path/to/artwork',
      trackPath: 'path/to/track',
      releasePath: 'path/to/release',
      userPath: 'path/to/user',
      publisher: 'publisher',
      playlistId: undefined,
      titleColor: textColorClass(set, !isPlayable),
      subtitleColor: subtextColorClass(set, !isPlayable),
    },
  });
};

describe('PlaylistTrackTableRowMobile', () => {
  it('emit when click item', async () => {
    const wrapper = factory(false, false, false, 'track');
    const row = wrapper.findComponent(PlaylistTrackTableRowMobile);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item(false, 'track'));
  });

  it('emit when click favorite button', async () => {
    const wrapper = factory(false, false, false, 'track');
    const row = wrapper.findComponent(PlaylistTrackTableRowMobile);
    expect(row.exists()).toBe(true);
    await row.vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item(false, 'track'));
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item(false, 'track'));
  });

  it('normal to active', async () => {
    const wrapper = factory(false, false, true, 'track');
    const title = wrapper.find('tr > td:nth-child(2) > div > div:first-child');
    const subtitle = wrapper.find('tr > td:nth-child(2) > div > div.g-small-text');
    expect(title.classes()).not.toContain(activeClass);
    expect(subtitle.classes()).toContain(subtextClass);

    await wrapper.setProps({
      set: true,
      playing: true,
      titleColor: activeClass,
      subtitleColor: activeClass,
    });
    expect(title.classes()).toContain(activeClass);
    expect(subtitle.classes()).toContain(activeClass);
  });

  it('inacive', async () => {
    const wrapper = factory(false, false, false, 'track');
    const title = wrapper.find('tr > td:nth-child(2) > div > div:first-child');
    const subtitle = wrapper.find('tr > td:nth-child(2) > div > div.g-small-text');
    expect(title.classes()).toContain(inactiveClass);
    expect(subtitle.classes()).toContain(inactiveClass);
  });

  it('track', () => {
    const wrapper = factory(false, false, false, 'track');
    expect(wrapper.findComponent(TrackMenu).exists()).toBe(true);
    expect(wrapper.findComponent(EpisodeMenu).exists()).toBe(false);
  });

  it('episode', () => {
    const wrapper = factory(false, false, false, 'episode');
    expect(wrapper.findComponent(TrackMenu).exists()).toBe(false);
    expect(wrapper.findComponent(EpisodeMenu).exists()).toBe(true);
  });

  it.todo('explicit item');
});
