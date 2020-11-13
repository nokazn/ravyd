import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import RepeatButton from './RepeatButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import { SpotifyAPI } from '~~/types';

const CLICK = 'click';

const $stateMock = (repeatMode: 0 | 1 | 2) => {
  return jest.fn().mockReturnValue({
    playback: {
      repeatMode,
    },
  });
};
const $gettersMock = (isDisallowed: boolean) => {
  return jest.fn().mockReturnValue({
    'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => {
      return d === 'toggling_repeat_context' || d === 'toggling_repeat_track'
        ? isDisallowed
        : false;
    },
  });
};
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (mode: 0 | 1 | 2, isDisallowed: boolean = false, size: number = 32) => {
  return mount(RepeatButton, {
    ...options,
    propsData: {
      size,
    },
    mocks: {
      ...mocks,
      $state: $stateMock(mode),
      $getters: $gettersMock(isDisallowed),
      $dispatch: $dispatchMock,
    },
  });
};

describe('RepeatButton', () => {
  it('normal mode', async () => {
    const wrapper = factory(0);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('リピート再生');
    expect(button.props().iconColor).toBe('inactive');
    expect(wrapper.find('.v-icon.mdi-repeat-off').exists()).toBe(true);
  });

  it('repeat mode', async () => {
    const wrapper = factory(1);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('曲をリピート再生');
    expect(button.props().iconColor).toBe('active-icon');
    expect(wrapper.find('.v-icon.mdi-repeat').exists()).toBe(true);
  });

  it('repeat-once mode', async () => {
    const wrapper = factory(2);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('リピート再生しない');
    expect(button.props().iconColor).toBe('active-icon');
    expect(wrapper.find('.v-icon.mdi-repeat-once').exists()).toBe(true);
  });

  it('disabled', async () => {
    const wrapper = factory(0, true);
    expect(wrapper.findComponent(CircleButton).props().disabled).toBe(true);
  });

  it('size 36', async () => {
    const wrapper = factory(0, false, 36);
    expect(wrapper.findComponent(CircleButton).props().size).toBe(36);
  });

  it('click button', async () => {
    const wrapper = factory(0);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/repeat');
  });
});
