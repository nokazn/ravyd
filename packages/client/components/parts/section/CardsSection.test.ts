import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import CardsSection from './CardsSection.vue';

const APPEAR = 'appear';
const CLICK = 'click';
const MOUSEOVER = 'mouseover';
const INPUT = 'input';
const ON_BUTTON_HOVERED = 'on-button-hovered';
const ON_LOADING_APPEARED = 'on-loading-appeared';

describe('CardsSection', () => {
  it('showing all & full items', async () => {
    const wrapper = mount(CardsSection, {
      ...options,
      propsData: {
        value: true,
        more: false,
        title: 'title',
      },
    });
    // コンポーネントとしては存在するが、loading 自体は表示されない
    expect(wrapper.findComponent(IntersectionLoadingCircle).exists()).toBe(true);
    expect(wrapper.find('.v-progress-circular').exists()).toBe(false);

    await wrapper.findComponent(ShowAllButton).trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('folded & full items', async () => {
    const wrapper = mount(CardsSection, {
      ...options,
      propsData: {
        value: false,
        more: false,
        title: 'title',
      },
    });
    expect(wrapper.findComponent(IntersectionLoadingCircle).exists()).toBe(false);

    const button = wrapper.findComponent(ShowAllButton);
    await button.trigger(MOUSEOVER);
    expect(wrapper.emitted(ON_BUTTON_HOVERED)).toBeTruthy();
    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });

  it('showing all & not full items', async () => {
    const wrapper = mount(CardsSection, {
      ...options,
      propsData: {
        value: true,
        more: true,
        title: 'title',
      },
    });
    const loading = wrapper.findComponent(IntersectionLoadingCircle);
    expect(loading.exists()).toBe(true);

    loading.vm.$emit(APPEAR);
    expect(wrapper.emitted(ON_LOADING_APPEARED)).toBeTruthy();

    await wrapper.findComponent(ShowAllButton).trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('folded & not full items', async () => {
    const wrapper = mount(CardsSection, {
      ...options,
      propsData: {
        value: false,
        more: true,
        title: 'title',
      },
    });
    expect(wrapper.findComponent(IntersectionLoadingCircle).exists()).toBe(false);

    const button = wrapper.findComponent(ShowAllButton);
    await button.trigger(MOUSEOVER);
    expect(wrapper.emitted(ON_BUTTON_HOVERED)).toBeTruthy();
    await button.trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });
});
