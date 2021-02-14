import { mount } from '@vue/test-utils';
import ScrollableCardsSection from './ScrollableCardsSection.vue';
import { options } from '~/tests/mocks/mount';

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
