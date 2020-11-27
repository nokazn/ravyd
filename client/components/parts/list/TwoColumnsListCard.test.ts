import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import TwoColumnsListCard from './TwoColumnsListCard.vue';

const item = (i: number) => ({
  title: `title${i}`,
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
    const items = wrapper.findAll('.v-list-item');
    expect(items.at(0).find('.v-list-item__title > div:first-child').text()).toBe('title1');
    expect(items.at(0).find('.v-list-item__title > div:nth-child(2)').text()).toBe('value1');
    expect(items.at(1).find('.v-list-item__title > div:first-child').text()).toBe('title2');
    expect(items.at(1).find('.v-list-item__title > div:nth-child(2)').text()).toBe('value2');
  });
});
