import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import NextButton from './NextButton.vue';

const CLICK = 'click';

const $getters = (disallowed: boolean) => () => ({
  'playback/isDisallowed': jest.fn().mockReturnValue(disallowed),
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

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
      $getters: $getters(disallowed),
      $dispatch,
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
    expect($dispatch).not.toHaveBeenCalled();
  });

  it('call pausing request', async () => {
    const wrapper = factory();
    await wrapper.trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/next');
  });
});
