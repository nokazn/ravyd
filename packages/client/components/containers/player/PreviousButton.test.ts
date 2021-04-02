import { mount } from '@vue/test-utils';
import type { VHas } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import PreviousButton from './PreviousButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

const CLICK = 'click';

const $getters = (disallowed: boolean = false, isBeginningOfTrack: boolean = false) => () => ({
  'playback/isBeginningOfTrack': isBeginningOfTrack,
  'playback/isDisallowed': jest.fn().mockReturnValue(disallowed),
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (
  disallowed: boolean = false,
  isBeginningOfTrack: boolean = false,
  propsData?: { size?: number },
) => {
  return mount(PreviousButton, {
    ...options,
    propsData,
    mocks: {
      ...mocks,
      $getters: $getters(disallowed, isBeginningOfTrack),
      $dispatch,
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
    expect($dispatch).not.toHaveBeenCalled();
  });

  it('call seeking request when skipping_prev is disallowed', async () => {
    const wrapper = factory(true);
    await wrapper.trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/seek', { positionMs: 0 });
  });

  it('call previous request when double-clicked in the last 1 sec', async () => {
    const wrapper = factory(false);
    await wrapper.setData({
      firstClicked: true,
    });
    await wrapper.trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/previous');
  });

  it('call restarting from beginning request', async () => {
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
    expect($dispatch).toHaveBeenCalledWith('playback/seek', { positionMs: 0 });
  });
});
