import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import ProgressBar from './ProgressBar.vue';

type PlaybackState = {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  disabledPlayingFromBeginning: boolean;
}

const $getters = (disallowed: boolean) => jest.fn().mockReturnValue({
  'playback/isDisallowed': () => disallowed,
});
const $state = (playback: PlaybackState) => jest.fn().mockReturnValue({ playback });
const $commit = jest.fn();
const $dispatch = jest.fn();
const $subscribe = jest.fn();

const factory = (
  state: PlaybackState,
  height?: number,
  disallowed: boolean = false,
) => {
  const vm = mount(ProgressBar, {
    ...options,
    propsData: {
      height,
    },
    mocks: {
      ...mocks,
      $state: $state(state),
      $getters: $getters(disallowed),
      $commit,
      $dispatch,
      $subscribe,
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
    }, 4);
    expect(wrapper.find('.v-progress-linear').props().height).toBe(4);
  });

  it('progress', async () => {
    const wrapper = factory({
      positionMs: 2 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    });
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
    });
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('active-icon');
  });

  it('paused', async () => {
    const wrapper = factory({
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    });
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('grey lighten-2');
  });

  it.todo('stop updating seek bar when paused');
  it.todo('start updating seek bar after playing');
  it.todo('add a few seconds');
});
