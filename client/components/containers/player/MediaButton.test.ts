import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import MediaButton from './MediaButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';
import type { SpotifyAPI } from '~~/types';

const CLICK = 'click';

const $stateMock = (isPlaying: boolean) => jest.fn().mockReturnValue({
  playback: {
    isPlaying,
  },
});
const $gettersMock = (disallowed: boolean) => jest.fn().mockReturnValue({
  // @todo resuming
  'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => (d === 'interrupting_playback'
    ? disallowed
    : false),
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  playing: boolean,
  propsData?: {
    size?: number;
    circle?: boolean,
  },
  disabled: boolean = false,
) => {
  return mount(MediaButton, {
    ...options,
    propsData,
    mocks: {
      ...mocks,
      $state: $stateMock(playing),
      $getters: $gettersMock(disabled),
      $dispatch: $dispatchMock,
    },
  });
};

describe('MediaButton', () => {
  it('normal icon size', () => {
    const wrapper = factory(true, {
      size: 32,
    });
    expect(wrapper.findComponent(CircleButton).props().iconSize).toBe(24);
  });

  it('circle icon size', () => {
    const wrapper = factory(true, {
      size: 32,
      circle: true,
    });
    expect(wrapper.findComponent(CircleButton).props().iconSize).toBe(32);
  });

  it('playing', () => {
    const wrapper = factory(true);
    const circleButton = wrapper.findComponent(CircleButton);
    expect(circleButton.attributes().title).toBe('停止');
    expect(circleButton.find('.v-icon').classes()).toContain('mdi-pause');
  });

  it('playing with circle icon', () => {
    const wrapper = factory(true, {
      circle: true,
    });
    const circleButton = wrapper.findComponent(CircleButton);
    expect(circleButton.attributes().title).toBe('停止');
    expect(circleButton.find('.v-icon').classes()).toContain('mdi-pause-circle');
  });

  it('paused', () => {
    const wrapper = factory(false);
    const circleButton = wrapper.findComponent(CircleButton);
    expect(circleButton.attributes().title).toBe('再生');
    expect(circleButton.find('.v-icon').classes()).toContain('mdi-play');
  });

  it('paused with circle icon', () => {
    const wrapper = factory(false, {
      circle: true,
    });
    const circleButton = wrapper.findComponent(CircleButton);
    expect(circleButton.attributes().title).toBe('再生');
    expect(circleButton.find('.v-icon').classes()).toContain('mdi-play-circle');
  });

  it('disallowed resume', async () => {
    const wrapper = factory(false, undefined, true);
    const circleButton = wrapper.findComponent(CircleButton);
    expect(circleButton.props().disabled).toBe(true);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).not.toHaveBeenCalled();
  });

  it('call play request', async () => {
    const wrapper = factory(false);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/play');
  });

  it('call pause request', async () => {
    const wrapper = factory(true);
    await wrapper.trigger(CLICK);
    expect($dispatchMock).toHaveBeenCalledWith('playback/pause');
  });
});
