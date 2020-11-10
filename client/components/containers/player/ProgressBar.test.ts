import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import ProgressBar from './ProgressBar.vue';

type PlaybackState = {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  disabledPlayingFromBeginning: boolean;
}

const $gettersMock = (seekingDisallowed: boolean) => jest.fn().mockReturnValue({
  'playback/isDisallowed': jest.fn().mockReturnValue(seekingDisallowed),
});
const $stateMock = (playback: PlaybackState) => jest.fn().mockReturnValue({ playback });
const $commitMock = jest.fn();
const $dispatchMock = jest.fn();
const $subscribeMock = jest.fn();

const factory = (
  state: PlaybackState,
  disallowed: boolean,
  height: number = 2,
) => {
  const vm = mount(ProgressBar, {
    ...options,
    propsData: {
      height,
    },
    mocks: {
      ...mocks,
      $state: $stateMock(state),
      $getters: $gettersMock(disallowed),
      $commit: $commitMock,
      $dispatch: $dispatchMock,
      $subscribe: $subscribeMock,
    },
  });
  return vm;
};

describe('ProgressBar', () => {
  it('height prop', () => {
    const wrapper = factory({
      positionMs: 2 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }, false, 4);
    expect(wrapper.find('.v-progress-linear').props().height).toBe(4);
  });

  it('progress', async () => {
    const wrapper = factory({
      positionMs: 2 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }, false);
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().value).toBe(50);
    // @todo state の更新
  });

  it('playing', async () => {
    const wrapper = factory({
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: true,
      disabledPlayingFromBeginning: false,
    }, false);
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('active-icon');
  });

  it('paused', async () => {
    const wrapper = factory({
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }, false);
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('grey lighten-2');
  });
});
