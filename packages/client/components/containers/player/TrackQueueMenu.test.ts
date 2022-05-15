import { mount } from '@vue/test-utils';
import type { VHas } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import type { App } from '~/entities';
import TrackQueueMenu from './TrackQueueMenu.vue';

const CLICK = 'click';

const artist = (i: number) => ({
  name: `artistName${i}`,
  id: `artistId${i}`,
  uri: `artistUri${i}`,
});
const item = (
  i: number,
  isSet: boolean = false,
  isPlaying: boolean = false,
): App.TrackQueue => ({
  index: i,
  isSet,
  isPlaying,
  type: 'track',
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

const $getters = (items: App.TrackQueue[], uri: string) => {
  return jest.fn().mockReturnValue({
    'playback/trackQueue': items,
    'playback/contextUri': uri,
  });
};
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (items: App.TrackQueue[], uri: string = 'contextUri') => {
  return mount(TrackQueueMenu, {
    ...options,
    mocks: {
      ...mocks,
      $getters: $getters(items, uri),
      $dispatch,
    },
  });
};

describe('TrackQueueMenu', () => {
  it('open menu', async () => {
    const wrapper = factory([
      item(-1),
      item(0, true),
      item(1),
      item(2),
    ]);
    const vm = wrapper.vm as VHas<'menu', boolean>;
    expect(vm.menu).toBe(false);
    await wrapper.findAll('.v-btn--icon').at(0).trigger(CLICK);
    expect(vm.menu).toBe(true);
  });

  it.todo('call next request when item clicked');
  it.todo('call next request 2 times when item clicked');
  it.todo('empty track queue');
  it.todo('link to /library/history');
});
