import { mount } from '@vue/test-utils';
import Card from './Card.vue';

const CLICK = 'click';
const $constant = {
  CARD_BACKGROUND_COLOR: '#2e3032',
};

const factory = (isLoaded: boolean) => mount(Card, {
  data() {
    return { isLoaded };
  },
  mocks: { $constant },
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
