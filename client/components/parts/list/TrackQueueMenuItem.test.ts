import { mount, RouterLinkStub } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import { App } from '~~/types';
import TrackQueueMenuItem from './TrackQueueMenuItem.vue';

const CLICK = 'click';
const ON_ITEM_CLICKED = 'on-item-clicked';
const ON_LINK_CLICKED = 'on-link-clicked';

const activeTextClass = 'active--text';
const subtextClass = 'subtext--text';

const artistMock = {
  name: 'name',
  id: 'id',
  uri: 'uri',
};
const index = 1;
const uri = 'uri';
const partialItem: Omit<App.TrackQueueInfo, 'isPlaying' | 'isSet'> = {
  index,
  type: 'track',
  id: 'id',
  name: 'name',
  uri,
  releaseId: 'releaseId',
  releaseName: 'releaseName',
  artists: [artistMock],
  images: [],
  linkedFrom: undefined,
  durationMs: 10000,
};

const factory = (isSet: boolean, isPlaying: boolean) => {
  return mount(TrackQueueMenuItem, {
    ...options,
    propsData: {
      item: partialItem,
      isSet,
      isPlaying,
    },
  });
};

describe('TrackQueueMenuItem', () => {
  it('from normal to active', async () => {
    const wrapper = factory(false, false);
    const title = wrapper.find('.v-list-item__title');
    const subtitles = wrapper.find('.v-list-item__subtitle');
    const icon = wrapper.find('.v-list-item__action > .v-icon');
    expect(title.classes()).not.toContain(activeTextClass);
    expect(subtitles.classes()).toContain(subtextClass);
    expect(icon.isVisible()).toBe(false);

    // play a track
    await wrapper.setProps({
      item: {
        ...partialItem,
        isSet: true,
        isPlaying: true,
      },
    });
    expect(title.classes()).toContain(activeTextClass);
    expect(subtitles.classes()).toContain(activeTextClass);
    expect(icon.isVisible()).toBe(true);
  });

  it('emit on item clicked', async () => {
    const wrapper = factory(false, false);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(ON_ITEM_CLICKED)?.[0][0]).toEqual({
      index,
      uri,
    });
  });

  it('emit on link clicked', async () => {
    const wrapper = factory(false, false);
    await wrapper
      .find('.v-list-item__subtitle > *:first-child')
      .findComponent(RouterLinkStub)
      .trigger(CLICK);
    expect(wrapper.emitted(ON_LINK_CLICKED)?.[0]).toBeTruthy();
    await wrapper.find('.v-list-item__subtitle > *:nth-child(3)').trigger(CLICK);
    expect(wrapper.emitted(ON_LINK_CLICKED)?.[1]).toBeTruthy();
  });
});
