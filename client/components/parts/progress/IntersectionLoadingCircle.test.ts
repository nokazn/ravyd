import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import IntersectionLoadingCircle from './IntersectionLoadingCircle.vue';
import type { VHas } from '~~/types';

describe('IntersectionLoadingCircle', () => {
  it('exist template ref & v-progress-circular', async () => {
    const wrapper = mount(IntersectionLoadingCircle, {
      ...options,
      propsData: {
        loading: true,
      },
    });
    expect((wrapper.vm as VHas<'LOADING_REF'>).LOADING_REF).toBeTruthy();
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
  });
});
