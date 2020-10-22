import { mount, Wrapper } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';

import ContentListSection from './ContentListSection.vue';
import type { App } from '~~/types';

const item = (i: number): App.ContentItemInfo<'artist'> => ({
  type: 'artist',
  id: `id${i}`,
  releaseId: 'releaseId',
  name: 'name',
  uri: 'uri',
  externalUrls: {
    spotify: 'path/to/spotify',
  },
  images: [],
  to: 'path/to/item',
  linkedFrom: undefined,
});
const createItems = (length: number) => [...new Array(length)].map((_, i) => item(i));

const factory = (length: number | undefined, itemCounts: number) => {
  return mount(ContentListSection, {
    ...options,
    propsData: {
      title: 'section',
      items: createItems(itemCounts),
      length,
    },
  });
};
const findNthElement = (w: Wrapper<Vue>, i: number) => {
  return w.find(`.v-list > *:nth-child(${i})`);
};

describe('ContentListSection', () => {
  it('3 / 5 items is visible', async () => {
    const wrapper = factory(3, 5);
    expect(findNthElement(wrapper, 1).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 2).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 3).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 4).isVisible()).toBe(false);
    expect(findNthElement(wrapper, 5).isVisible()).toBe(false);
  });

  it('5 / 5 items is visible', async () => {
    const wrapper = factory(5, 5);
    expect(findNthElement(wrapper, 1).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 2).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 3).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 4).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 5).isVisible()).toBe(true);
  });

  it('length is undefined', async () => {
    const wrapper = factory(undefined, 5);
    expect(findNthElement(wrapper, 1).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 2).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 3).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 4).isVisible()).toBe(true);
    expect(findNthElement(wrapper, 5).isVisible()).toBe(true);
  });
});
