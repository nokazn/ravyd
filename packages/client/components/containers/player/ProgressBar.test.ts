import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import ProgressBar from './ProgressBar.vue';

interface PlaybackGetters {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  isDisallowed: boolean;
}

const $getters = (getters: PlaybackGetters) => () => ({
  'playback/positionMs': getters.positionMs,
  'playback/durationMs': getters.durationMs,
  'playback/isPlaying': getters.isPlaying,
  'playback/isDisallowed': jest.fn().mockReturnValue(getters.isDisallowed),
});
const $commit = jest.fn();
const $dispatch = jest.fn();
const $subscribe = jest.fn();

const factory = (
  getters: PlaybackGetters,
  height?: number,
) => {
  const vm = mount(ProgressBar, {
    ...options,
    propsData: {
      height,
    },
    mocks: {
      ...mocks,
      $getters: $getters(getters),
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
      isDisallowed: false,
    }, 4);
    expect(wrapper.find('.v-progress-linear').props().height).toBe(4);
  });

  it('progress', async () => {
    const wrapper = factory({
      positionMs: 2 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      isDisallowed: false,
    });
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().value).toBe(50);
    // TODO: state の更新
  });

  it('playing', async () => {
    const wrapper = factory({
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: true,
      isDisallowed: false,
    });
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('active-icon');
  });

  it('paused', async () => {
    const wrapper = factory({
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      isDisallowed: false,
    });
    const vProgressLinear = wrapper.findComponent({ name: 'VProgressLinear' });
    expect(vProgressLinear.props().color).toBe('white');
  });

  it.todo('stop updating seek bar when paused');
  it.todo('start updating seek bar after playing');
  it.todo('add a few seconds');
});
