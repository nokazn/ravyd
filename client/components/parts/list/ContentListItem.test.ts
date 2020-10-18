import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import ContentListItem from './ContentListItem.vue';

const CLICK = 'click';

describe('ContentListItem', () => {
  it('emit on clicked', async () => {
    const wrapper = mount(ContentListItem, {
      ...options,
      propsData: {
        item: {
          type: 'track',
          id: 'id',
          releaseId: 'releaseId',
          name: 'name',
          uri: 'uri',
          externalUrls: {
            spotify: 'path/to/spotify',
          },
          images: [],
          to: 'path/to/item',
          artists: [{
            name: 'name',
            id: 'id',
          }],
        },
      },
    });
    await wrapper.find('.v-list-item').trigger(CLICK);
    expect(wrapper.emitted(CLICK)).toBeTruthy();
  });
});
