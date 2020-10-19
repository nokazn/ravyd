import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import DeviceSelectMenuItem from './DeviceSelectMenuItem.vue';

const CLICK = 'click';

const id = 'id';
const factory = (isActive: boolean, disabled: boolean) => {
  return mount(DeviceSelectMenuItem, {
    ...options,
    propsData: {
      item: {
        id,
        type: 'Computer',
        isActive,
        disabled,
        title: '再生中のデバイス',
        subtitle: 'Chrome',
      },
    },
  });
};

describe('DeviceSelectMenuItem', () => {
  it('active device', () => {
    const wrapper = factory(true, false);
    expect(wrapper.find('.v-list-item__title').classes()).toContain('active--text');
    expect(wrapper.find('.v-list-item__subtitle').classes()).toContain('active--text');
    expect(wrapper.findAll('.v-icon').at(0).classes()).toContain('active--text');
    expect(wrapper.findAll('.v-icon').at(1).classes()).toContain('active--text');
  });

  it('inactive device', async () => {
    const wrapper = factory(false, false);
    expect(wrapper.find('.v-list-item__title').classes()).not.toContain('active--text');
    expect(wrapper.find('.v-list-item__subtitle').classes()).not.toContain('active--text');
    expect(wrapper.findAll('.v-icon').at(0).classes()).not.toContain('active--text');
    expect(wrapper.findAll('.v-icon').at(1).classes()).not.toContain('active--text');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(CLICK)?.[0]).toEqual([id]);
  });

  it('disabled device', async () => {
    const wrapper = factory(false, true);
    expect(wrapper.find('.v-list-item__title').classes()).toContain('inactive--text');
    expect(wrapper.find('.v-list-item__subtitle').classes()).toContain('inactive--text');
    expect(wrapper.findAll('.v-icon').at(0).classes()).toContain('inactive--text');
    expect(wrapper.findAll('.v-icon').at(1).classes()).toContain('inactive--text');
  });
});
