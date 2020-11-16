import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import PreviousButton from './PreviousButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import type { SpotifyAPI, VHas } from '~~/types';

const CLICK = 'click';

const $stateMock = (disabledPlayingFromBeginning: boolean = false) => jest.fn().mockReturnValue({
  playback: {
    disabledPlayingFromBeginning,
  },
});
const $gettersMock = (disallowed: boolean = false) => jest.fn().mockReturnValue({
  'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => (d === 'skipping_prev'
    ? disallowed
    : false),
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  disallowedSkippingPrev: boolean = false,
  disabledPlayingFromBeginning: boolean = false,
  propsData?: {
    size?: number;
  },
) => {
  return mount(PreviousButton, {
    ...options,
    propsData,
    mocks: {
      ...mocks,
      $state: $stateMock(disabledPlayingFromBeginning),
      $getters: $gettersMock(disallowedSkippingPrev),
      $dispatch: $dispatchMock,
    },
  });
};

describe('PreviousButton', () => {
  it('size prop', () => {
    const wrapper = factory(false, false, {
      size: 32,
    });
    expect(wrapper.findComponent(CircleButton).props().size).toBe(32);
  });

  it('disallowed skipping_prev & disabled playing from beginning', async () => {
    const wrapper = factory(true, true);
    expect(wrapper.findComponent(CircleButton).props().disabled).toBe(true);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).not.toHaveBeenCalled();
  });

  it('call seek request when skipping_prev is disallowed', async () => {
    const wrapper = factory(true);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/seek', { positionMs: 0 });
  });

  it('call seek previous when double-clicked in the last 1 sec', async () => {
    const wrapper = factory(false);
    await wrapper.setData({
      firstClicked: true,
    });
    await wrapper.trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/previous');
  });

  it('call seek previous', async () => {
    const wrapper = factory(false);
    await wrapper.trigger(CLICK);
    const vm = wrapper.vm as VHas<'firstClicked', boolean>;
    expect(vm.firstClicked).toBe(true);
    jest.runOnlyPendingTimers();
    // in 1000 ms timer
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1000);
    expect(vm.firstClicked).toBe(false);
    // in 400 ms timer
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 400);
    expect($dispatchMock).toHaveBeenCalledWith('playback/seek', { positionMs: 0 });
  });
});
