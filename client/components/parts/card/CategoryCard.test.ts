import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import CategoryCard from './CategoryCard.vue';

const factory = (isLoaded: boolean) => mount(CategoryCard, {
  ...options,
  propsData: {
    id: 'foo',
    name: 'foo',
    images: [],
  },
  data() {
    return { isLoaded };
  },
});

describe('CategoryCard', () => {
  it('not loaded', async () => {
    const wrapper = factory(false);
    expect(wrapper.find('.v-card').exists()).toBe(false);
  });

  it('loaded', async () => {
    const wrapper = factory(true);
    expect(wrapper.find('.v-card').exists()).toBe(true);
  });
});
