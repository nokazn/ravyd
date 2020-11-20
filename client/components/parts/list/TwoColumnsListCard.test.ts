import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TwoColumnsListCard from './TwoColumnsListCard.vue';

const item = (i: number) => ({
  name: `name${i}`,
  value: `value${i}`,
});

describe('TwoColumnsListCard', () => {
  it('component exists', async () => {
    const wrapper = mount(TwoColumnsListCard, {
      ...options,
      propsData: {
        items: [item(1), item(2)],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
