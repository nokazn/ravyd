import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import Card from './Card.vue';

const CLICK = 'click';

const factory = (isLoaded: boolean) => mount(Card, {
  ...options,
  data() {
    return { isLoaded };
  },
});

describe('Card', () => {
  it('not loaded', async () => {
    const wrapper = factory(false);
    expect(wrapper.find('.v-card').exists()).toBe(false);
  });

  it('loaded', async () => {
    const wrapper = factory(true);
    const card = wrapper.find('.v-card');
    expect(card.exists()).toBe(true);
    await card.trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });
});
