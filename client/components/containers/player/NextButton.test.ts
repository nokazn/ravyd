import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import NextButton from './NextButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

const CLICK = 'click';

const $gettersMock = (disabled: boolean) => jest.fn().mockReturnValue({
  'playback/isDisallowed': () => disabled,
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  disabled: boolean = false,
  propsData?: {
    size?: number;
  },
) => {
  return mount(NextButton, {
    ...options,
    propsData,
    mocks: {
      ...mocks,
      $getters: $gettersMock(disabled),
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

  it('disabled', async () => {
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
