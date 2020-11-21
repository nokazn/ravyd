import { mount, RouterLinkStub } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import { App } from '~~/types';
import TrackQueueMenuItem from './TrackQueueMenuItem.vue';

type Item = Omit<App.TrackQueue, 'isPlaying' | 'isSet'>;

const CLICK = 'click';
const ON_ITEM_CLICKED = 'on-item-clicked';
const ON_LINK_CLICKED = 'on-link-clicked';

const activeTextClass = 'active--text';
const subtextClass = 'subtext--text';

const artist = (i: number) => ({
  name: `name${i}`,
  id: `id${i}`,
  uri: `uri${i}`,
});

const item = (i: number, type: 'track' | 'episode' = 'track'): Item => ({
  index: i,
  type,
  id: `id${i}`,
  name: `name${i}`,
  uri: `uri${i}`,
  releaseId: 'releaseId',
  releaseName: 'releaseName',
  artists: [artist(i)],
  images: [],
  linkedFrom: undefined,
  durationMs: 10000,
});

const factory = (track: Item, isSet: boolean, isPlaying: boolean) => {
  return mount(TrackQueueMenuItem, {
    ...options,
    propsData: {
      item: track,
      isSet,
      isPlaying,
    },
  });
};

describe('TrackQueueMenuItem', () => {
  it('title', () => {
    const wrapper = factory(item(1), false, false);
    expect(wrapper.find('.v-list-item').attributes().title).toBe('name1 を再生');
  });

  it('release path', () => {
    const wrapper = factory(item(1), false, false);
    expect(wrapper.findAll('.v-list-item__subtitle > *').length).toBe(3);
    expect(wrapper.findAll('.v-list-item__subtitle > *').at(2).props().to).toBe('/releases/releaseId');
  });

  it('display only show name when an episode are set', () => {
    const wrapper = factory(item(1, 'episode'), false, false);
    expect(wrapper.findAll('.v-list-item__subtitle > *').length).toBe(1);
    expect(wrapper.findAll('.v-list-item__subtitle > *').at(0).text()).toBe('releaseName');
  });

  it('from normal to active', async () => {
    const wrapper = factory(item(1), false, false);
    const title = wrapper.find('.v-list-item__title');
    const subtitles = wrapper.find('.v-list-item__subtitle');
    const icon = wrapper.find('.v-list-item__action > .v-icon');
    expect(title.classes()).not.toContain(activeTextClass);
    expect(subtitles.classes()).toContain(subtextClass);
    expect(icon.isVisible()).toBe(false);

    // play a track
    await wrapper.setProps({
      item: {
        ...item(1),
        isSet: true,
        isPlaying: true,
      },
    });
    expect(title.classes()).toContain(activeTextClass);
    expect(subtitles.classes()).toContain(activeTextClass);
    expect(icon.isVisible()).toBe(true);
  });

  it('emit when item clicked', async () => {
    const wrapper = factory(item(1), false, false);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_ITEM_CLICKED)?.[0][0]).toEqual(item(1));
  });

  it('emit when link clicked', async () => {
    const wrapper = factory(item(1), false, false);
    await wrapper
      .find('.v-list-item__subtitle > *:first-child')
      .findComponent(RouterLinkStub)
      .trigger(CLICK);
    expect(wrapper.emitted(ON_LINK_CLICKED)?.[0]).toBeTruthy();
    await wrapper.find('.v-list-item__subtitle > *:nth-child(3)').trigger(CLICK);
    expect(wrapper.emitted(ON_LINK_CLICKED)?.[1]).toBeTruthy();
  });
});
