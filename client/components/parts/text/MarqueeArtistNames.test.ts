import { mount, RouterLinkStub } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import MarqueeArtistNames from './MarqueeArtistNames.vue';
import type { App, VHas } from '~~/types';

const artist = (i: number): App.MinimumArtist => ({
  id: `id${i}`,
  name: `name${i}`,
  uri: `uri${i}`,
});

describe('MarqueeArtistNames', () => {
  it('exist template ref', () => {
    const wrapper = mount(MarqueeArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1)],
      },
    });
    expect((wrapper.vm as VHas<'MARQUEE_TEXT_REF'>).MARQUEE_TEXT_REF).toBeTruthy();
  });

  it('3 artists', () => {
    const wrapper = mount(MarqueeArtistNames, {
      ...options,
      propsData: {
        artists: [artist(1), artist(2), artist(3)],
      },
    });
    expect(wrapper.find('div').attributes('title')).toBe('name1, name2, name3');
    const links = wrapper.findAllComponents(RouterLinkStub);
    const commas = wrapper.findAll('div > div > span');
    expect(links.length).toBe(3);
    expect(commas.length).toBe(2);
    expect(links.at(0).props('to')).toBe('/artists/id1');
    expect(links.at(0).text()).toBe('name1');
    expect(links.at(1).props('to')).toBe('/artists/id2');
    expect(links.at(1).text()).toBe('name2');
    expect(links.at(2).props('to')).toBe('/artists/id3');
    expect(links.at(2).text()).toBe('name3');
  });
});
