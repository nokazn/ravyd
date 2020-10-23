import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import DeviceSelectMenuItem from './DeviceSelectMenuItem.vue';

const CLICK = 'click';

const activeClass = 'active--text';
const inactiveClass = 'inactive--text';
const id = 'id';
const item = (isActive: boolean, disabled: boolean) => ({
  id,
  type: 'Computer',
  isActive,
  disabled,
  title: '再生中のデバイス',
  subtitle: 'Chrome',
});
const factory = (isActive: boolean, disabled: boolean) => {
  return mount(DeviceSelectMenuItem, {
    ...options,
    propsData: {
      item: item(isActive, disabled),
    },
  });
};

describe('DeviceSelectMenuItem', () => {
  it('active device', () => {
    const wrapper = factory(true, false);
    expect(wrapper.find('.v-list-item__title').classes()).toContain(activeClass);
    expect(wrapper.find('.v-list-item__subtitle').classes()).toContain(activeClass);
    expect(wrapper.findAll('.v-icon').at(0).classes()).toContain(activeClass);
    expect(wrapper.findAll('.v-icon').at(1).classes()).toContain(activeClass);
  });

  it('inactive device', async () => {
    const wrapper = factory(false, false);
    expect(wrapper.find('.v-list-item__title').classes()).not.toContain(activeClass);
    expect(wrapper.find('.v-list-item__subtitle').classes()).not.toContain(activeClass);
    expect(wrapper.findAll('.v-icon').at(0).classes()).not.toContain(activeClass);
    expect(wrapper.findAll('.v-icon').at(1).classes()).not.toContain(activeClass);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(CLICK)?.[0]).toEqual([id]);
  });

  it('disabled device', async () => {
    const wrapper = factory(false, true);
    expect(wrapper.find('.v-list-item__title').classes()).toContain(inactiveClass);
    expect(wrapper.find('.v-list-item__subtitle').classes()).toContain(inactiveClass);
    expect(wrapper.findAll('.v-icon').at(0).classes()).toContain(inactiveClass);
    expect(wrapper.findAll('.v-icon').at(1).classes()).toContain(inactiveClass);
  });

  it('normal to active', async () => {
    const wrapper = factory(false, false);
    const title = wrapper.find('.v-list-item__title');
    const subtitle = wrapper.find('.v-list-item__subtitle');
    const icons = wrapper.findAll('.v-icon');
    expect(title.classes()).not.toContain(activeClass);
    expect(subtitle.classes()).not.toContain(activeClass);
    expect(icons.at(0).classes()).not.toContain(activeClass);
    expect(icons.at(1).classes()).not.toContain(activeClass);

    await wrapper.setProps({
      item: item(true, false),
    });
    expect(title.classes()).toContain(activeClass);
    expect(subtitle.classes()).toContain(activeClass);
    expect(icons.at(0).classes()).toContain(activeClass);
    expect(icons.at(1).classes()).toContain(activeClass);
  });
});
