import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import TrackQueueMenu from './TrackQueueMenu.vue';
import type { App } from '~~/types';

const CLICK = 'click';

const artistMock = (i: number) => ({
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
  artists: [artistMock(i)],
  images: [],
  linkedFrom: undefined,
  durationMs: 10000,
});

const $gettersMock = (items: App.TrackQueue[], uri: string) => {
  return jest.fn().mockReturnValue({
    'playback/trackQueue': items,
    'playback/contextUri': uri,
  });
};
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (items: App.TrackQueue[], uri: string = 'contextUri') => {
  return mount(TrackQueueMenu, {
    ...options,
    mocks: {
      ...mocks,
      $getters: $gettersMock(items, uri),
      $dispatch: $dispatchMock,
    },
  });
};

describe('TrackQueueMenu', () => {
  it('opne menu', async () => {
    const wrapper = factory([
      item(-1),
      item(0, true),
      item(1),
      item(2),
    ]);
    // @ts-ignore
    expect(wrapper.vm.menu).toBe(false);
    await wrapper.findAll('.v-btn--icon').at(0).trigger(CLICK);
    // @ts-ignore
    expect(wrapper.vm.menu).toBe(true);
  });

  // @todo menu 内のテスト
});
