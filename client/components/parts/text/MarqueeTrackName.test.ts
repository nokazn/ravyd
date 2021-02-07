import { mount, RouterLinkStub } from '@vue/test-utils';
import type { SpotifyAPI, VHas } from 'shared/types';
import { options } from '~/tests/mocks/mount';
import MarqueeTrackName from './MarqueeTrackName.vue';

const factory = (type: SpotifyAPI.Player.PlayingType) => {
  return mount(MarqueeTrackName, {
    ...options,
    propsData: {
      id: 'id',
      releaseId: 'releaseId',
      name: 'name',
      type,
    },
  });
};

describe('MarqueeTrackName', () => {
  it('exist template ref', () => {
    const wrapper = factory('track');
    expect((wrapper.vm as VHas<'MARQUEE_TEXT_REF'>).MARQUEE_TEXT_REF).toBeTruthy();
  });

  it('track', () => {
    const wrapper = factory('track');
    expect(wrapper.find('div').attributes('title')).toBe('name');
    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.exists()).toBe(true);
    expect(link.props('to')).toEqual({
      path: '/releases/releaseId',
      query: { track: 'id' },
    });
    expect(link.text()).toBe('name');
  });

  it('episode', () => {
    const wrapper = factory('episode');
    expect(wrapper.find('div').attributes('title')).toBe('name');
    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.exists()).toBe(true);
    expect(link.props('to')).toBe('/episodes/id');
    expect(link.text()).toBe('name');
  });

  it('neither a track or an episode', () => {
    const wrapper = factory('unknown');
    expect(wrapper.find('div').attributes('title')).toBe('name');
    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.exists()).toBe(false);
  });
});
