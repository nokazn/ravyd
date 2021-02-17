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
    expect(wrapper.find('.v-btn').attributes().title).toBe('保存しない');
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(false);
  });

  it('not favorited', async () => {
    const wrapper = mount(FavoriteButton, {
      ...options,
      propsData: {
        value: false,
      },
    });
    expect(wrapper.find('.v-btn').attributes().title).toBe('保存する');
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart-outline');
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(true);
  });

  it.todo('color & icon size when fab prop is set to true');
  it.todo('color & icon size when fab prop is set to false');
  it.todo('icon color when outlined prop is set to true');
  it.todo('icon color when outlined prop is set to false');
  it.todo('disabled prop');
});
