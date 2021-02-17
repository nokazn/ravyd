import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ExplicitChip from './ExplicitChip.vue';

describe('ExplicitChip', () => {
  it('component exists', async () => {
    const wrapper = mount(ExplicitChip, options);
    expect(wrapper.exists()).toBe(true);
  });
});
