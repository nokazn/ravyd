import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import VolumeSlider from './VolumeSlider.vue';
import type { ZeroToHundred } from '~~/types';

const CHANGE = 'change';
const CLICK = 'click';

const $state = (volumePercent: ZeroToHundred, isMuted: boolean) => () => ({
  playback: {
    volumePercent,
    isMuted,
  },
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (volumePercent: ZeroToHundred, isMuted: boolean = false) => {
  return mount(VolumeSlider, {
    ...options,
    mocks: {
      ...mocks,
      $state: $state(volumePercent, isMuted),
      $dispatch,
    },
  });
};

describe('VolumeSlider', () => {
  it('volume 0%', async () => {
    const wrapper = factory(0);
    expect(wrapper.attributes().title).toBe('ボリューム 0%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 33%', async () => {
    const wrapper = factory(33);
    expect(wrapper.attributes().title).toBe('ボリューム 33%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-low');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(33);
  });

  it('volume 34%', async () => {
    const wrapper = factory(34);
    expect(wrapper.attributes().title).toBe('ボリューム 34%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-medium');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(34);
  });

  it('volume 66%', async () => {
    const wrapper = factory(66);
    expect(wrapper.attributes().title).toBe('ボリューム 66%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-medium');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(66);
  });

  it('volume 67%', async () => {
    const wrapper = factory(67);
    expect(wrapper.attributes().title).toBe('ボリューム 67%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-high');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(67);
  });

  it('volume 100%', async () => {
    const wrapper = factory(100);
    expect(wrapper.attributes().title).toBe('ボリューム 100%');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBeUndefined();
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュート');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-high');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(100);
  });

  it('volume 0% & mute', async () => {
    const wrapper = factory(0, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 33% & mute', async () => {
    const wrapper = factory(33, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 34% & mute', async () => {
    const wrapper = factory(34, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 66% & mute', async () => {
    const wrapper = factory(66, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 67% & mute', async () => {
    const wrapper = factory(67, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('volume 100% & mute', async () => {
    const wrapper = factory(100, true);
    expect(wrapper.attributes().title).toBe('ミュート中');
    expect(wrapper.find('div > .v-btn--icon').props().color).toBe('inactive');
    expect(wrapper.find('div > .v-btn--icon').attributes().title).toBe('ミュートを解除');
    expect(wrapper.find('div > .v-btn--icon .v-icon').classes()).toContain('mdi-volume-mute');
    expect(wrapper.findComponent({ name: 'VSlider' }).props().value).toBe(0);
  });

  it('change volume', async () => {
    const wrapper = factory(100);
    await wrapper.findComponent({ name: 'VSlider' }).vm.$emit(CHANGE, 50);
    expect($dispatch).toHaveBeenCalledWith('playback/volume', { volumePercent: 50 });
  });

  it('toggle mute', async () => {
    const wrapper = factory(100, true);
    await wrapper.find('div > .v-btn--icon').trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playback/mute');
  });
});
