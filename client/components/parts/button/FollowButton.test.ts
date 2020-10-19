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
    expect(wrapper.get('.v-icon').classes()).toContain('mdi-heart');
    const button = wrapper.get('.v-btn');
    expect(button.text()).toBe('フォロー中');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('not followed', async () => {
    const wrapper = mount(FollowButton, {
      ...options,
      propsData: {
        value: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart-plus-outline');
    const button = wrapper.get('.v-btn');
    expect(button.text()).toBe('フォロー');
    await button.trigger(CLICK);
    expect(button.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
