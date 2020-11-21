import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mountWithoutRouter';
import Fallback from './Fallback.vue';

const CLICK = 'click';

describe('Fallback', () => {
  it('click reload button', async () => {
    const go = jest.fn();
    const wrapper = mount(Fallback, {
      ...options,
      mocks: {
        $router: {
          go,
        },
      },
    });
    await wrapper.find('.Fallback__wrapper > .v-btn').trigger(CLICK);
    expect(go).toHaveBeenCalledWith(0);
  });
});
