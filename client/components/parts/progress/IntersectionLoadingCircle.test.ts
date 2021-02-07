import { mount } from '@vue/test-utils';
import type { VHas } from 'shared/types';
import { options } from '~/tests/mocks/mount';
import IntersectionLoadingCircle from './IntersectionLoadingCircle.vue';

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

  it.todo('emit appear when scrolled');
});
