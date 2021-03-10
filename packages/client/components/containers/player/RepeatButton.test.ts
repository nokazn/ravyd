import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import RepeatButton from './RepeatButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import type { App } from '~/entities';

const CLICK = 'click';

const $state = (repeatMode: App.RepeatMode) => () => ({
  playback: {
    repeatMode,
  },
});
const $getters = (isDisallowed: boolean) => () => ({
  'playback/isDisallowed': jest.fn().mockReturnValue(isDisallowed),
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (mode: App.RepeatMode, isDisallowed: boolean = false, size: number = 32) => {
  return mount(RepeatButton, {
    ...options,
    propsData: {
      size,
    },
    mocks: {
      ...mocks,
      $state: $state(mode),
      $getters: $getters(isDisallowed),
      $dispatch,
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
    expect($dispatch).toHaveBeenCalledWith('playback/repeat');
  });
});
