import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import EpisodeTableRowMobile from './EpisodeTableRow.mobile.vue';
import { textColorClass, subtextColorClass } from '~/utils/text';
import { App } from '~~/types';

const CLICK = 'click';
const ON_ROW_CLICKED = 'on-row-clicked';

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
  return mount(EpisodeTableRowMobile, {
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

describe('EpisodeTableRowMobile', () => {
  it('emit when click item', async () => {
    const wrapper = factory(false, false, false);
    const row = wrapper.findComponent(EpisodeTableRowMobile);
    expect(row.exists()).toBe(true);
    await row.trigger(CLICK);
    expect(wrapper.emitted(ON_ROW_CLICKED)?.[0][0]).toEqual(item(false));
  });

  it('normal to active', async () => {
    const wrapper = factory(false, false, true);
    const title = wrapper.find('tr > td:first-child > div > div');
    const subtitle = wrapper.find('div.g-small-text');
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

  it('inactive', async () => {
    const wrapper = factory(false, false, false);
    const title = wrapper.find('tr > td:first-child > div > div');
    const subtitle = wrapper.find('div.g-small-text');
    expect(title.classes()).toContain(inactiveClass);
    expect(subtitle.classes()).toContain(inactiveClass);
  });

  it.todo('explicit item');
});
