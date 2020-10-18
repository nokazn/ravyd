import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import CircleButton from './CircleButton.vue';

const CLICK = 'click';

describe('CircleButton', () => {
  it('emit on clicked', async () => {
    const wrapper = mount(CircleButton, options);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });
});
