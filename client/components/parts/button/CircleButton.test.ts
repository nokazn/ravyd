import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import CircleButton from './CircleButton.vue';

const CLICK = 'click';

describe('CircleButton', () => {
  it('emit when clicked', async () => {
    const wrapper = mount(CircleButton, options);
    await wrapper.trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });

  it.todo('color & icon size when fab prop is set to true');
  it.todo('color & icon size when fab prop is set to false');
  it.todo('disabled prop');
});
