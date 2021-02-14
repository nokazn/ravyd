import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import Card from './Card.vue';

const factory = (isLoaded: boolean, width: number | [number, number]) => {
  const widthProps = Array.isArray(width)
    ? { minWidth: width[0], maxWidth: width[1] }
    : { width };
  return mount(Card, {
    ...options,
    propsData: {
      to: 'to',
      ...widthProps,
    },
    data() {
      return { isLoaded };
    },
  });
};

describe('Card', () => {
  it('not loaded', async () => {
    const wrapper = factory(false, 200);
    expect(wrapper.find('.v-card').exists()).toBe(false);
  });

  it('loaded', async () => {
    const wrapper = factory(true, 200);
    expect(wrapper.find('.v-card').exists()).toBe(true);
  });

  it.todo('width prop');
  it.todo('minWidth & maxWidth prop');
  it.todo('disable card link & enable custom router navigation when custom is set to true');
  it.todo('hideSubtitle prop');
});
