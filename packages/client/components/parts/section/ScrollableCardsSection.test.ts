import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ScrollableCardsSection from './ScrollableCardsSection.vue';

describe('ScrollableCardsSection', () => {
  it('title', () => {
    const wrapper = mount(ScrollableCardsSection, {
      ...options,
      propsData: {
        title: 'title',
      },
      mocks: {
        $screen: {
          width: 1200,
          cardWidth: 200,
        },
      },
    });
    expect(wrapper.find('section > h2').text()).toBe('title');
  });
});
