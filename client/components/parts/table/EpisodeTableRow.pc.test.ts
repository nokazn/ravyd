import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import EpisodeTableRowPc from './EpisodeTableRow.pc.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

const CLICK = 'click';
const ON_ROW_CLICKED = 'on-row-clicked';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const subtextClass = 'subtext--text';
const item = (isPlayable: boolean): App.EpisodeDetail => ({
  index: 1,
  id: 'id',
  name: 'name',
  uri: 'uri',
  description: 'description',
  images: [],
  isPlayable,
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
});
const factory = (set: boolean, playing: boolean, isPlayable: boolean) => {
  return mount(EpisodeTableRowPc, {
    ...options,
    propsData: {
      item: item(isPlayable),
      publisher: 'publisher',
      set,
      playing,
      episodePath: 'path/to/episode',
      titleColor: textColorClass(set, !isPlayable),
      subtitleColor: subtextColorClass(set, !isPlayable),
      releaseDate: 'releaseDate',
    },
  });
};

describe('EpisodeTableRowPc', () => {
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
    const title = wrapper.find('.Content__left > *:first-child');
    const subtitle = wrapper.find('.Content__left > .g-small-text');
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
    const wrapper = factory(false, false, false);
    const title = wrapper.find('.Content__left > *:first-child');
    const subtitle = wrapper.find('.Content__left > .g-small-text');
    expect(title.classes()).toContain(inactiveClass);
    expect(subtitle.classes()).toContain(inactiveClass);
  });
});
