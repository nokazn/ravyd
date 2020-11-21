import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TrackListMediaButton from './TrackListMediaButton.vue';

const CLICK = 'click';
const INPUT = 'input';

const inactiveClass = 'inactive--text';

describe('TrackListMediaButton', () => {
  it('playing', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: true,
        hover: false,
        disabled: false,
        trackNumber: 3,
      },
    });
    const icon = wrapper.findAll('.v-icon').at(1);
    expect(icon.isVisible()).toBe(true);
    expect(icon.attributes('title')).toBe('再生中');
    expect(icon.classes()).toContain('mdi-volume-high');
  });

  it('hover when playing', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: true,
        hover: true,
        disabled: false,
        trackNumber: 3,
      },
    });
    const button = wrapper.find('.v-btn');
    expect(button.isVisible()).toBe(true);
    expect(button.attributes('title')).toBe('停止');

    const icon = wrapper.find('.v-btn .v-icon');
    expect(icon.classes()).toContain('mdi-pause');

    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('not playing', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: false,
        hover: false,
        disabled: false,
        trackNumber: 3,
      },
    });
    const text = wrapper.find('span > span');
    expect(text.isVisible()).toBe(true);
    expect(text.text()).toBe('3');
  });

  it('hover when not playing', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: false,
        hover: true,
        disabled: false,
        trackNumber: 3,
      },
    });
    const button = wrapper.find('.v-btn');
    expect(button.isVisible()).toBe(true);
    expect(button.attributes('title')).toBe('再生');

    const icon = wrapper.find('.v-btn .v-icon');
    expect(icon.classes()).toContain('mdi-play');

    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });

  it('disabled', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: false,
        hover: false,
        disabled: true,
        trackNumber: 3,
      },
    });
    const text = wrapper.find('span > span');
    expect(text.classes()).toContain(inactiveClass);
    expect(text.attributes('title')).toBe('再生できない項目');
  });

  it('hover with disabled', async () => {
    const wrapper = mount(TrackListMediaButton, {
      ...options,
      propsData: {
        value: false,
        hover: true,
        disabled: true,
        trackNumber: 3,
      },
    });
    const text = wrapper.find('span > span');
    expect(text.classes()).toContain(inactiveClass);
    expect(text.attributes('title')).toBe('再生できない項目');
  });
});
