import { mount, RouterLinkStub } from '@vue/test-utils';
import CategoryCard from './CategoryCard.vue';

const factory = (isLoaded: boolean) => mount(CategoryCard, {
  propsData: {
    id: 'foo',
    name: 'foo',
    images: [],
  },
  data() {
    return { isLoaded };
  },
  stubs: {
    NuxtLink: RouterLinkStub,
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
