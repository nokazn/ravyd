import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ReleaseArtwork from './ReleaseArtwork.vue';
import ImageOverlay from './ImageOverlay.vue';

const CLICK = 'click';
const LOAD = 'load';
const ON_MEDIA_BUTTON_CLICKED = 'on-media-button-clicked';
const ON_LOADED = 'on-loaded';

const factory = (overlay: boolean) => {
  return mount(ReleaseArtwork, {
    ...options,
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

describe('ReleaseArtwork', () => {
  it('emit when clicked', async () => {
    const wrapper = factory(true);
    await wrapper.findComponent(ImageOverlay).find('.v-btn').trigger(CLICK);
    expect(wrapper.emitted(ON_MEDIA_BUTTON_CLICKED)).toBeTruthy();
  });

  it('emit when load', async () => {
    const wrapper = factory(false);
    await wrapper.find('.v-image').trigger(LOAD);
    expect(wrapper.emitted(ON_LOADED)).toBeTruthy();
  });

  it.todo('width prop');
  it.todo('minWidth & maxWidth prop');
  it.todo('custom icon');
  it.todo('icon size');
  it.todo('overlay prop');
});
