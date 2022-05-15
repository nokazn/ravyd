import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';
import TrackListSection from './TrackListSection.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('TrackListSection', () => {
  it('show all', async () => {
    const wrapper = mount(TrackListSection, {
      ...options,
      propsData: {
        value: true,
        title: 'title',
      },
    });
    await wrapper.findComponent(ShowAllButton).trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([false]);
  });

  it('folded', async () => {
    const wrapper = mount(TrackListSection, {
      ...options,
      propsData: {
        value: false,
        title: 'title',
      },
    });
    await wrapper.findComponent(ShowAllButton).trigger(CLICK);
    expect(wrapper.emitted(INPUT)?.[0]).toEqual([true]);
  });

  it('hidden show-all button', async () => {
    const wrapper = mount(TrackListSection, {
      ...options,
      propsData: {
        title: 'title',
      },
    });
    expect(wrapper.findComponent(ShowAllButton).exists()).toBe(false);
  });
});
