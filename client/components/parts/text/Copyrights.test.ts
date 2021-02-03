import { mount } from '@vue/test-utils';
import { options } from '~/tests/mocks/mount';
import Copyrights from './Copyrights.vue';
import type { SpotifyAPI } from '~~/types';

const copyrights = (type: 'C' | 'P', recordName: string): SpotifyAPI.Copyright => ({
  type,
  text: `2020 ${recordName} Records`,
});

describe('Copyrights', () => {
  it('different texts', () => {
    const wrapper = mount(Copyrights, {
      ...options,
      propsData: {
        copyrights: [copyrights('C', 'Foo'), copyrights('P', 'Bar')],
      },
    });
    const smalls = wrapper.findAll('div > small');
    expect(smalls.length).toBe(2);
    expect(smalls.at(0).text()).toBe('© 2020 Foo Records');
    expect(smalls.at(1).text()).toBe('℗ 2020 Bar Records');
  });

  it('the same texts', () => {
    const wrapper = mount(Copyrights, {
      ...options,
      propsData: {
        copyrights: [copyrights('C', 'Foo'), copyrights('P', 'Foo')],
      },
    });
    const smalls = wrapper.findAll('div > small');
    expect(smalls.length).toBe(1);
    expect(smalls.at(0).text()).toBe('©℗ 2020 Foo Records');
  });
});
