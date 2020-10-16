import { mount } from '@vue/test-utils';
import FavoriteButton from './FavoriteButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('FavoriteButton', () => {
  it('favorited', async () => {
    const wrapper = mount(FavoriteButton, {
      propsData: {
        value: true,
      },
    });
    // @todo a が含まれる？
    expect(wrapper.get('.v-icon').classes()).toContain('amdi-heart');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('not favorited', async () => {
    const wrapper = mount(FavoriteButton, {
      propsData: {
        value: false,
      },
    });
    // @todo a が含まれる？
    expect(wrapper.find('.v-icon').classes()).toContain('amdi-heart-outline');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
