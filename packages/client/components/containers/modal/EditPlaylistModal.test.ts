import Vue from 'vue';
import { mount } from '@vue/test-utils';
import { options, mocks } from '~/tests/mocks/mount';
import EditPlaylistModal from './EditPlaylistModal.vue';
import PlaylistModal from '~/components/containers/modal/PlaylistModal.vue';

type Form = {
  name: string;
  description: string;
  isPrivate: boolean;
  isCollaborative: boolean;
  playlistId?: string ;
};

const CLICK = 'click';
const INPUT = 'input';
const UPDATE_IMAGE = 'update:image';

const form = (
  i: number,
  isPrivate: boolean = false,
  isCollaborative: boolean = false,
): Form => ({
  playlistId: `playlistId${i}`,
  name: `name${i}`,
  description: `description${i}`,
  isPrivate,
  isCollaborative,
});
const $dispatch = jest.fn().mockResolvedValue(undefined);

const factory = (value: boolean, f: Form) => {
  const vm = mount(EditPlaylistModal, {
    ...options,
    propsData: {
      value,
      form: f,
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
  return vm;
};

describe('EditPlaylistModal', () => {
  it('toggle modal', async () => {
    const wrapper = factory(false, form(1));
    const VDialog = wrapper.findComponent({ name: 'VDialog' });
    expect(VDialog.props().value).toBe(false);
    await VDialog.vm.$emit(INPUT, true);
    expect(wrapper.emitted(INPUT)?.[0][0]).toBe(true);
    await wrapper.setProps({
      value: true,
    });
    expect(VDialog.props().value).toBe(true);
  });

  it('when an image is uploaded', async () => {
    const wrapper = factory(false, form(1));
    const modal = wrapper.findComponent(PlaylistModal);
    await modal.vm.$emit(UPDATE_IMAGE, true);
    expect(wrapper.emitted(UPDATE_IMAGE)?.[0]).toBeTruthy();
  });

  it('update a playlist', async () => {
    const wrapper = factory(true, form(1));
    await wrapper.find('.v-form > *:first-child input').setValue('name2');
    await Vue.nextTick();
    await wrapper.find('.v-card__actions > .v-btn:nth-child(2)').trigger(CLICK);
    expect($dispatch).toHaveBeenCalledWith('playlists/editPlaylist', {
      playlistId: 'playlistId1',
      name: 'name2',
      description: 'description1',
      isPublic: true,
      isCollaborative: false,
    });
  });
});
