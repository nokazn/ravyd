import { mount } from '@vue/test-utils';
import TrackListSection from './TrackListSection.vue';
import { options } from '~/tests/mocks/mount';
import ShowAllButton from '~/components/parts/button/ShowAllButton.vue';

const CLICK = 'click';
const INPUT = 'input';

describe('TrackListSection', () => {
  it('showing all', async () => {
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

  it('hidden shown-all button', async () => {
    const wrapper = mount(TrackListSection, {
      ...options,
      propsData: {
        title: 'title',
      },
    });
    expect(wrapper.findComponent(ShowAllButton).exists()).toBe(false);
  });
});
