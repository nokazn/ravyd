import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import FollowButton from './FollowButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('FollowButton', () => {
  it('followed', async () => {
    const wrapper = mount(FollowButton, {
      ...options,
      propsData: {
        value: true,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart');
    const button = wrapper.findComponent({ name: 'VBtn' });
    expect(button.text()).toBe('フォロー中');
    expect(button.props().color).toBe('secondary');
    expect(button.props().outlined).toBe(false);
    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(false);
  });

  it('not followed', async () => {
    const wrapper = mount(FollowButton, {
      ...options,
      propsData: {
        value: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart-plus-outline');
    const button = wrapper.findComponent({ name: 'VBtn' });
    expect(button.text()).toBe('フォロー');
    expect(button.props().color).toBeUndefined();
    expect(button.props().outlined).toBe(true);
    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(true);
  });

  it.todo('hover when value is true');
});
