import { mount } from '@vue/test-utils';
import TrackTableGroupHeader from './TrackTableGroupHeader.vue';
import { options } from '~/tests/mocks/mount';

const subtextClass = 'subtext--text';

const factory = (discNumber: number = 1, colspan: number = 2) => {
  return mount(TrackTableGroupHeader, {
    ...options,
    propsData: {
      discNumber,
      colspan,
    },
  });
};

describe('TrackTableGroupHeader', () => {
  it('mobile', () => {
    const wrapper = factory();
    expect(wrapper.find('td').attributes().colspan).toBe('2');
    expect(wrapper.findAll('td > *').at(0).classes()).toContain(subtextClass);
    expect(wrapper.findAll('td > *').at(1).text()).toBe('1');
    expect(wrapper.findAll('td > *').at(1).classes()).toContain(subtextClass);
  });
});
