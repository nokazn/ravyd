import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import NextButton from './NextButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import { SpotifyAPI } from '~~/types';

const CLICK = 'click';

const $gettersMock = (disallowed: boolean) => jest.fn().mockReturnValue({
  'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => (d === 'skipping_next'
    ? disallowed
    : false),
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  disallowed: boolean = false,
  propsData?: {
    size?: number;
  },
) => {
  return mount(NextButton, {
    ...options,
    propsData,
    mocks: {
      ...mocks,
      $getters: $gettersMock(disallowed),
      $dispatch: $dispatchMock,
    },
  });
};

describe('NextButton', () => {
  it('size prop', () => {
    const wrapper = factory(false, {
      size: 32,
    });
    expect(wrapper.findComponent(CircleButton).props().size).toBe(32);
  });

  it('disallowed skipping_next', async () => {
    const wrapper = factory(true);
    expect(wrapper.findComponent(CircleButton).props().disabled).toBe(true);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).not.toHaveBeenCalled();
  });

  it('call pause request', async () => {
    const wrapper = factory();
    await wrapper.trigger(CLICK);
    expect($dispatchMock).toHaveBeenNthCalledWith(1, 'playback/next');
  });
});
