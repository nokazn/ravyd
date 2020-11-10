import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import SeekBar from './SeekBar.vue';

const MOUSEDOWN = 'mousedown';
const CHANGE = 'change';

type PlaybackState = {
  positionMs: number;
  durationMs: number;
  isPlaying: boolean;
  disabledPlayingFromBeginning: boolean;
}

const $gettersMock = (seekingDisallowed: boolean) => jest.fn().mockReturnValue({
  'playback/isDisallowed': jest.fn().mockReturnValue(seekingDisallowed),
});
// @todo state 変更したときの状態テストしたい
const $stateMock = (firstState: PlaybackState, secondState?: PlaybackState) => jest.fn()
  .mockReturnValueOnce({ playback: firstState })
  .mockReturnValue({ playback: secondState ?? firstState });
const $commitMock = jest.fn();
const $dispatchMock = jest.fn().mockResolvedValue(undefined);
const $subscribeMock = jest.fn();

const factory = (
  [firstState, secondState]: PlaybackState[],
  disallowed: boolean,
  hideText: boolean = false,
  thumbColor: string = 'white',
) => {
  const vm = mount(SeekBar, {
    ...options,
    propsData: {
      hideText,
      thumbColor,
    },
    mocks: {
      ...mocks,
      $state: $stateMock(firstState, secondState),
      $getters: $gettersMock(disallowed),
      $commit: $commitMock,
      $dispatch: $dispatchMock,
      $subscribe: $subscribeMock,
    },
  });
  return vm;
};

describe('SeekBar', () => {
  it('set true to false for hideText prop', async () => {
    const wrapper = factory([{
      positionMs: 2 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }], false, false);
    expect(wrapper.findAll('div.SeekBar > *').length).toBe(2);
    expect(wrapper.find('div.SeekBar > div.SeekBar__mss').exists()).toBe(true);

    await wrapper.setProps({
      hideText: true,
    });
    expect(wrapper.findAll('div.SeekBar > *').length).toBe(1);
    expect(wrapper.find('div.SeekBar > div.SeekBar__mss').exists()).toBe(false);
  });

  it('thumbColor prop', async () => {
    const wrapper = factory([{
      positionMs: 2.5 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }], false, false, 'grey');
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    expect(vSlider.props().thumbColor).toBe('grey');
  });

  it('playing at 2:30 / 4:00', async () => {
    const wrapper = factory([{
      positionMs: 2.5 * 60 * 1000,
      durationMs: 4 * 60 * 1000,
      isPlaying: true,
      disabledPlayingFromBeginning: false,
    }], false);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    expect(vSlider.props().color).toBe('active-icon');
    expect(vSlider.props().value).toBe((2 * 60 + 30) * 1000);
    expect(vSlider.props().max).toBe(4 * 60 * 1000);
    expect(vSlider.props().disabled).toBe(false);
    expect(wrapper.find('div > *:nth-child(2) > span:first-child').text()).toBe('2:30');
    const durationMss = wrapper.find('div > *:nth-child(2) > span:nth-child(2)');
    expect(durationMss.text()).toBe('4:00');
    expect(durationMss.attributes().title).toBeUndefined();
  });

  it('paused at 2:30 / Infinity (in case of playing episode with another device)', async () => {
    const wrapper = factory([{
      positionMs: 2.5 * 60 * 1000,
      durationMs: Infinity,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }], false);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    expect(vSlider.props().color).toBe('grey lighten-2');
    expect(vSlider.props().value).toBe((2 * 60 + 30) * 1000);
    expect(vSlider.props().max).toBe(Infinity);
    expect(vSlider.props().disabled).toBe(true);
    expect(wrapper.find('div > *:nth-child(2) > span:first-child').text()).toBe('2:30');
    const durationMss = wrapper.find('div > *:nth-child(2) > span:nth-child(2)');
    expect(durationMss.text()).toBe('???');
    expect(durationMss.attributes().title).toBe('再生時間が取得できません');
  });

  it('disabled seeking', async () => {
    const wrapper = factory([{
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: false,
      disabledPlayingFromBeginning: false,
    }], true);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    expect(vSlider.props().disabled).toBe(true);
  });

  it('on mousedown', async () => {
    const wrapper = factory([{
      positionMs: 0,
      durationMs: 4 * 60 * 1000,
      isPlaying: true,
      disabledPlayingFromBeginning: false,
    }], false);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    const clearTimerMock = jest.spyOn(window, 'clearInterval').mockReturnValue();
    await vSlider.vm.$emit(MOUSEDOWN);
    expect(clearTimerMock).toHaveBeenCalled();
  });

  it('on change from 2:30 to 2:45', async () => {
    const wrapper = factory([
      // initialized
      {
        positionMs: 2.5 * 60 * 1000,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: false,
      },
      // called for currentPositionMs
      {
        positionMs: 2.5 * 60 * 1000,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: false,
      },
      {
        positionMs: 2.75 * 60 * 1000,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: false,
      },
    ], false);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    const clearTimerMock = jest.spyOn(window, 'clearInterval').mockReturnValue();
    const setIntervalMock = jest.spyOn(window, 'setInterval').mockReturnValue({} as ReturnType<typeof setInterval>);
    await vSlider.vm.$emit(CHANGE, 2.75 * 60 * 1000);
    expect(clearTimerMock).toHaveBeenCalled();
    expect($commitMock).toHaveBeenNthCalledWith(1, 'playback/SET_POSITION_MS', 2.75 * 60 * 1000);
    expect($dispatchMock).toHaveBeenNthCalledWith(1, 'playback/seek', {
      positionMs: 2.75 * 60 * 1000,
      currentPositionMs: 2.5 * 60 * 1000,
    });
    expect(setIntervalMock).toHaveBeenCalled();
  });

  it('on change from 2:30 to 0:00', async () => {
    const wrapper = factory([
      // initialized
      {
        positionMs: 2.5 * 60 * 1000,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: false,
      },
      // called for currentPositionMs
      {
        positionMs: 2.5 * 60 * 1000,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: false,
      },
      {
        positionMs: 0,
        durationMs: 4 * 60 * 1000,
        isPlaying: true,
        disabledPlayingFromBeginning: true,
      },
    ], false);
    const vSlider = wrapper.findComponent({ name: 'VSlider' });
    const clearTimerMock = jest.spyOn(window, 'clearInterval').mockReturnValue();
    const setIntervalMock = jest.spyOn(window, 'setInterval').mockReturnValue({} as ReturnType<typeof setInterval>);
    await vSlider.vm.$emit(CHANGE, 0);
    expect(clearTimerMock).toHaveBeenCalled();
    expect($commitMock).toHaveBeenNthCalledWith(2, 'playback/SET_POSITION_MS', 0);
    expect($commitMock).toHaveBeenNthCalledWith(3, 'playback/SET_DISABLED_PLAYING_FROM_BEGINNING', true);
    expect($dispatchMock).toHaveBeenNthCalledWith(2, 'playback/seek', {
      positionMs: 0,
      currentPositionMs: 2.5 * 60 * 1000,
    });
    expect(setIntervalMock).toHaveBeenCalled();
  });
});
