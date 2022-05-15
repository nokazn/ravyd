import { mount } from '@vue/test-utils';
import type { VHas } from 'shared/types';
import { options, mocks } from '~/tests/mocks/mount';
import type { App } from '~/entities';
import DeviceSelectMenu from './DeviceSelectMenu.vue';

const CLICK = 'click';

const device = (i: number, isActive: boolean = false, disabled: boolean = false) => ({
  id: `id${i}`,
  type: 'Computer' as const,
  isActive,
  disabled,
  title: `title${i}`,
  subtitle: `subtitle${i}`,
});
const $getters = (deviceState: App.DeviceState, devices: App.Device[]) => () => ({
  'playback/deviceState': deviceState,
  'playback/deviceList': devices,
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (
  deviceState: App.DeviceState,
  devices: App.Device[],
) => {
  const vm = mount(DeviceSelectMenu, {
    ...options,
    mocks: {
      ...mocks,
      $getters: $getters(deviceState, devices),
      $dispatch,
    },
  });
  return vm;
};

describe('DeviceSelectMenu', () => {
  it('this device is active', () => {
    const wrapper = factory('self', [device(1, false), device(2, true)]);
    expect(wrapper.find('.v-btn--icon').props().color).toBe('active-icon');
  });

  it('this device is inactive', () => {
    const wrapper = factory('another', [device(1, true), device(2, false)]);
    expect(wrapper.find('.v-btn--icon').props().color).toBe(undefined);
  });

  it('open menu', async () => {
    const wrapper = factory('another', [device(1), device(2)]);
    const vm = wrapper.vm as VHas<'menu', boolean>;
    expect(vm.menu).toBe(false);
    await wrapper.findAll('.v-btn--icon').at(0).trigger(CLICK);
    expect(vm.menu).toBe(true);
  });

  it.todo('update device list');
  it.todo('call transfer-playback request when item clicked');
});
