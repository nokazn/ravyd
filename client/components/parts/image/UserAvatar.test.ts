import { mount } from '@vue/test-utils';
import UserAvatar from './UserAvatar.vue';
import ImageOverlay from './ImageOverlay.vue';

const CLICK = 'click';
const LOAD = 'load';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

const factory = (overlay: boolean) => {
  return mount(UserAvatar, {
    propsData: {
      src: 'src/of/image',
      alt: 'image',
      size: 200,
      overlay,
    },
    mocks: {
      $screen: { isTouchScreen: false },
    },
  });
};

describe('UserAvatar', () => {
  it('emit on clicked', async () => {
    const wrapper = factory(true);
    // await wrapper.findComponent(ImageOverlay).find('v-btn').trigger(CLICK);
    await wrapper.findComponent(ImageOverlay).vm.$emit(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)).toBeTruthy();
  });

  it('emit on load', async () => {
    const wrapper = factory(false);
    await wrapper.find('.v-image').trigger(LOAD);
    expect(wrapper.emitted(ON_LOADED)).toBeTruthy();
  });
});
