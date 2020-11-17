import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import NavigationListItemGroup from './NavigationListItemGroup.vue';
import type { VHas } from '~~/types';

describe('NavigationListItemGroup', () => {
  it('exist virtual scroller wrapper ref', () => {
    const wrapper = mount(NavigationListItemGroup, {
      ...options,
      propsData: {
        items: [
          {
            name: 'name1',
            to: 'path/to/link1',
            icon: 'icon2',
            isSet: false,
            isPlaying: false,
          },
          {
            name: 'name2',
            to: 'path/to/link2',
            icon: 'icon2',
            isSet: true,
            isPlaying: true,
          },
        ],
        scroll: true,
      },
    });
    expect((wrapper.vm as VHas<'VIRTUAL_SCROLLER_WRAPPER_REF'>).VIRTUAL_SCROLLER_WRAPPER_REF).toBeTruthy();
  });
});
