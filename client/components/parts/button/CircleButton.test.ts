import { mount } from '@vue/test-utils';
import CircleButton from './CircleButton.vue';

const CLICK = 'click';

describe('CircleButton', () => {
  it('emit on clicked', async () => {
    const wrapper = mount(CircleButton);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });
});
