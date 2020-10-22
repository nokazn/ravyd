import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mountWithoutRouter';
import Fallback from './Fallback.vue';

const CLICK = 'click';

describe('Fallback', () => {
  it('click reload button', async () => {
    const routerGoMock = jest.fn();
    const wrapper = mount(Fallback, {
      ...options,
      mocks: {
        $router: {
          go: routerGoMock,
        },
      },
    });
    await wrapper.find('.Fallback__wrapper > .v-btn').trigger(CLICK);
    expect(routerGoMock).toHaveBeenCalledWith(0);
  });
});
