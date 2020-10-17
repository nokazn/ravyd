import { mount } from '@vue/test-utils';
import ImageOverlay from './ImageOverlay.vue';

const CLICK = 'click';

describe('ImageOverlay', () => {
  it('emit on clicked', async () => {
    const wrapper = mount(ImageOverlay, {
      propsData: {
        hover: true,
        icon: 'mdi-play-circle',
      },
      mocks: {
        $screen: { isTouchScreen: false },
      },
    });
    await wrapper.find('.v-btn').trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });

  it('invisible at a touch screen device', async () => {
    const wrapper = mount(ImageOverlay, {
      propsData: {
        hover: false,
        icon: 'mdi-play-circle',
      },
      mocks: {
        $screen: { isTouchScreen: true },
      },
    });
    expect(wrapper.isVisible()).toBe(false);
  });
});
