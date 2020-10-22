import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import IntersectionLoadingCircle from './IntersectionLoadingCircle.vue';

describe('IntersectionLoadingCircle', () => {
  it('exist template ref & v-pregress-circular', async () => {
    const wrapper = mount(IntersectionLoadingCircle, {
      ...options,
      propsData: {
        loading: true,
      },
    });
    // @ts-ignore
    expect(wrapper.vm.LOADING_REF).toBeTruthy();
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
  });
});
