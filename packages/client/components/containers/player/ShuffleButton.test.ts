import { mount } from '@vue/test-utils';
import type { SpotifyAPI } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import ShuffleButton from './ShuffleButton.vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

const CLICK = 'click';

const $getters = (isShuffled: boolean, isDisallowed: boolean) => () => ({
  'playback/isShuffled': isShuffled,
  'playback/isDisallowed': (d: keyof SpotifyAPI.Disallows) => (d === 'toggling_shuffle'
    ? isDisallowed
    : false),
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (isShuffled: boolean, isDisallowed: boolean = false, size: number = 32) => {
  return mount(ShuffleButton, {
    ...options,
    propsData: {
      size,
    },
    mocks: {
      ...mocks,
      $getters: $getters(isShuffled, isDisallowed),
      $dispatch,
    },
  });
};

describe('ShuffleButton', () => {
  it('normal mode', async () => {
    const wrapper = factory(false);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('シャッフル再生');
    expect(button.props().iconColor).toBe('inactive');
  });

  it('shuffle mode', async () => {
    const wrapper = factory(true);
    const button = wrapper.findComponent(CircleButton);
    expect(button.attributes().title).toBe('シャッフル再生しない');
    expect(button.props().iconColor).toBe('active-icon');
  });

  it('disabled', async () => {
    const wrapper = factory(false, true);
    expect(wrapper.findComponent(CircleButton).props().disabled).toBe(true);
  });

  it('size 36', async () => {
    const wrapper = factory(false, false, 36);
    expect(wrapper.findComponent(CircleButton).props().size).toBe(36);
  });

  it('click button', async () => {
    const wrapper = factory(false);
    await wrapper.findComponent(CircleButton).trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/shuffle');
  });
});
