import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import Modal from './Modal.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('Modal', () => {
  it('on close button clicked', async () => {
    const wrapper = mount(Modal, {
      ...options,
      propsData: {
        value: true,
      },
    });
    await wrapper.find('.v-card > div:first-child > .v-btn').trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(false);
  });

  it.todo('toggle modal');
});
