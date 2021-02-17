import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import HashTags from './HashTags.vue';

describe('HashTags', () => {
  it('capitalized tags', async () => {
    const wrapper = mount(HashTags, {
      ...options,
      propsData: {
        tags: ['dream pop', 'art pop', 'indie pop', 'chillwave'],
      },
    });
    expect(wrapper.findAll('.v-chip').at(0).text()).toBe('# DREAM POP');
    expect(wrapper.findAll('.v-chip').at(1).text()).toBe('# ART POP');
    expect(wrapper.findAll('.v-chip').at(2).text()).toBe('# INDIE POP');
    expect(wrapper.findAll('.v-chip').at(3).text()).toBe('# CHILLWAVE');
  });

  it.todo('color & textColor prop');
  it.todo('outlined prop');
});
