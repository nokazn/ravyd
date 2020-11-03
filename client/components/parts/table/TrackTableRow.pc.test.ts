import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TrackTableRowPc from './TrackTableRow.pc.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

const CLICK = 'click';
const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const subtextClass = 'subtext--text';

const artist = (i: number) => ({
  id: `id${i}`,
  name: 'name',
  uri: 'uri',
});
const item = (isPlayable: boolean): App.TrackDetail => ({
  type: 'track',
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
});
const factory = (set: boolean, playing: boolean, isPlayable: boolean) => {
  return mount(TrackTableRowPc, {
    ...options,
    propsData: {
      item: item(isPlayable),
      active: false,
      set,
      playing,
      titleColor: textColorClass(set, !isPlayable),
      subtitleColor: subtextColorClass(set, !isPlayable),
      releaseDate: 'releaseDate',
    },
  });
};

describe('TrackTableRowPc', () => {
  it('emit on click item', async () => {
    const wrapper = factory(false, false, false);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item(false));
  });

  it('emit on click media button', async () => {
    const wrapper = factory(false, false, false);
    await wrapper.vm.$emit(ON_MEDIA_BUTTON_CLICKED, item(false));
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)?.[0][0]).toEqual(item(false));
  });

  it('emit on click favorite button', async () => {
    const wrapper = factory(false, false, false);
    await wrapper.vm.$emit(ON_FAVORITE_BUTTON_CLICKED, item(false));
    expect(wrapper.emitted(ON_FAVORITE_BUTTON_CLICKED)?.[0][0]).toEqual(item(false));
  });

  it('normal to active', async () => {
    const wrapper = factory(false, false, true);
    const title = wrapper.find('td > div > span.g-ellipsis-text > *:first-child');
    const divider = wrapper.find('td > div > span.g-ellipsis-text > *:nth-child(2)');
    const artistNames = wrapper.find('td > div > span.g-ellipsis-text > *:nth-child(3)');
    expect(title.classes()).not.toContain(activeClass);
    expect(divider.classes()).toContain(subtextClass);
    expect(artistNames.classes()).toContain(subtextClass);

    await wrapper.setProps({
      set: true,
      playing: true,
      titleColor: activeClass,
      subtitleColor: activeClass,
    });
    expect(title.classes()).toContain(activeClass);
    expect(divider.classes()).toContain(activeClass);
    expect(artistNames.classes()).toContain(activeClass);
  });

  it('inacive', async () => {
    const wrapper = factory(false, false, false);
    const title = wrapper.find('td > div > span.g-ellipsis-text > *:first-child');
    const divider = wrapper.find('td > div > span.g-ellipsis-text > *:nth-child(2)');
    const artistNames = wrapper.find('td > div > span.g-ellipsis-text > *:nth-child(3)');
    expect(title.classes()).toContain(inactiveClass);
    expect(divider.classes()).toContain(inactiveClass);
    expect(artistNames.classes()).toContain(inactiveClass);
  });
});
