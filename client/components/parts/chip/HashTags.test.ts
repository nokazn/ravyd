import { mount } from '@vue/test-utils';
import HashTags from './HashTags.vue';

describe('HashTags', () => {
  it('capitalized tags', async () => {
    const wrapper = mount(HashTags, {
      propsData: {
        tags: ['dream pop', 'art pop', 'indie pop', 'chillwave'],
      },
    });
    expect(wrapper.findAll('.v-chip').at(0).text()).toBe('# DREAM POP');
    expect(wrapper.findAll('.v-chip').at(1).text()).toBe('# ART POP');
    expect(wrapper.findAll('.v-chip').at(2).text()).toBe('# INDIE POP');
    expect(wrapper.findAll('.v-chip').at(3).text()).toBe('# CHILLWAVE');
  });
});
