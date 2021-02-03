import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import CreatePlaylistModal from './CreatePlaylistModal.vue';

const CLICK = 'click';
const INPUT = 'input';

const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (value: boolean) => {
  return mount(CreatePlaylistModal, {
    ...options,
    propsData: {
      value,
    },
    mocks: {
      ...mocks,
      $dispatch,
      $subscribe: jest.fn(),
      $screen: {
        isSingleColumn: false,
      },
    },
  });
};

describe('CreatePlaylistModal', () => {
  it('toggle modal', async () => {
    const wrapper = factory(false);
    const VDialog = wrapper.findComponent({ name: 'VDialog' });
    expect(VDialog.props().value).toBe(false);
    await VDialog.vm.$emit(INPUT, true);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(true);
    await wrapper.setProps({
      value: true,
    });
    expect(VDialog.props().value).toBe(true);
  });

  it('create a playlist', async () => {
    const wrapper = factory(true);
    await wrapper.find('.v-form > *:first-child input').setValue('a');
    await Vue.nextTick();
    await wrapper.find('.v-card__actions > .v-btn:nth-child(2)').trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playlists/createPlaylist', {
      // TODO: undefined にする
      playlistId: '',
      name: 'a',
      description: '',
      isPublic: true,
      isCollaborative: false,
    });
  });
});
