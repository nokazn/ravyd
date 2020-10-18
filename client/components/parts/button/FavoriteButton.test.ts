import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import FavoriteButton from './FavoriteButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('FavoriteButton', () => {
  it('favorited', async () => {
    const wrapper = mount(FavoriteButton, {
      ...options,
      propsData: {
        value: true,
      },
    });
    expect(wrapper.get('.v-icon').classes()).toContain('mdi-heart');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('not favorited', async () => {
    const wrapper = mount(FavoriteButton, {
      ...options,
      propsData: {
        value: false,
      },
    });
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart-outline');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
