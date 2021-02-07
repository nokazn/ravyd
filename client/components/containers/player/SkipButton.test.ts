import { mount } from '@vue/test-utils';
import type { SpotifyAPI } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import SkipButton from './SkipButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

const CLICK = 'click';

const $state = (positionMs: number, durationMs: number) => {
  return jest.fn().mockReturnValue({
    playback: {
      positionMs,
      durationMs,
    },
  });
};
const $getters = (isDisallowed: boolean) => {
  return jest.fn().mockReturnValue({
    'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => (d === 'seeking'
      ? isDisallowed
      : false),
  });
};
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (
  positionMs: number,
  durationMs: number,
  seconds: number,
  size: number = 32,
  isDisallowed: boolean = false,
) => {
  return mount(SkipButton, {
    ...options,
    propsData: {
      seconds,
      size,
    },
    mocks: {
      ...mocks,
      $state: $state(positionMs, durationMs),
      $getters: $getters(isDisallowed),
      $dispatch,
    },
  });
};

describe('SkipButton', () => {
  it('+15sec', async () => {
    const wrapper = factory(0, 60 * 1000, 15);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('15秒進む');
    expect(wrapper.find('.v-icon.mdi-redo').exists()).toBe(true);
  });

  it('-15sec', async () => {
    const wrapper = factory(0, 60 * 1000, -15);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('15秒戻す');
    expect(wrapper.find('.v-icon.mdi-undo').exists()).toBe(true);
  });

  it('disabled', async () => {
    const wrapper = factory(0, 60 * 1000, 15, 32, true);
    expect(wrapper.findComponent(CircleButton).props().disabled).toBe(true);
  });

  it('size 36', async () => {
    const wrapper = factory(0, 60 * 1000, 15, 36);
    expect(wrapper.findComponent(CircleButton).props().size).toBe(36);
  });

  it('click +15sec button at 0:30/1:00', async () => {
    const wrapper = factory(30 * 1000, 60 * 1000, 15);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/seek', { positionMs: 45 * 1000 });
  });

  it('click +15sec button at 0:50/1:00', async () => {
    const wrapper = factory(50 * 1000, 60 * 1000, 15);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/next');
  });

  it('click -15sec button at 0:30/1:00', async () => {
    const wrapper = factory(30 * 1000, 60 * 1000, -15);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/seek', { positionMs: 15 * 1000 });
  });

  it('click -15sec button at 0:10/1:00', async () => {
    const wrapper = factory(10 * 1000, 60 * 1000, -15);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/seek', { positionMs: 0 });
  });
});
