import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import DeviceSelectMenu from './DeviceSelectMenu.vue';
import type { App, VHas } from '~~/types';

const CLICK = 'click';

const device = (i: number, isActive: boolean = false, disabled: boolean = false) => ({
  id: `id${i}`,
  type: 'Computer' as const,
  isActive,
  disabled,
  title: `title${i}`,
  subtitle: `subtitle${i}`,
});
const $gettersMock = (playing: boolean, devices: App.Device[]) => jest.fn().mockReturnValue({
  'playback/isThisAppPlaying': playing,
  'playback/deviceList': devices,
});
const $dispatchMock = jest.fn().mockResolvedValue(undefined);

const factory = (
  playing: boolean,
  devices: App.Device[],
) => {
  const vm = mount(DeviceSelectMenu, {
    ...options,
    mocks: {
      ...mocks,
      $getters: $gettersMock(playing, devices),
      $dispatch: $dispatchMock,
    },
  });
  return vm;
};

describe('DeviceSelectMenu', () => {
  it('this device is active', () => {
    const wrapper = factory(true, [device(1, false), device(2, true)]);
    expect(wrapper.find('.v-btn--icon').props().color).toBe('active-icon');
  });

  it('this device is inactive', () => {
    const wrapper = factory(false, [device(1, true), device(2, false)]);
    expect(wrapper.find('.v-btn--icon').props().color).toBe(undefined);
  });

  it('open menu', async () => {
    const wrapper = factory(false, [device(1), device(2)]);
    const vm = wrapper.vm as VHas<'menu', boolean>;
    expect(vm.menu).toBe(false);
    await wrapper.findAll('.v-btn--icon').at(0).trigger(CLICK);
    expect(vm.menu).toBe(true);
  });

  // @todo menu 内のテスト
});
