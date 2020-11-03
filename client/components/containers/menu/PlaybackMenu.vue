<template>
  <ContextMenu
    top
    left
    offset-x
    offset-y
    :groups="menuGroups"
    :loading="isLoading"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  unref,
  computed,
} from '@vue/composition-api';

import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import {
  useAddItemToQueueMenu,
  useArtistLinkMenu,
  useReleaseLinkMenu,
} from '~/use/spotify';
import type { App } from '~~/types';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: 'on-favorite-menu-clicked';
}

const emptyMenuItem = (name: string) : App.MenuItem<'custom'> => ({
  type: 'custom',
  name,
  handler: () => {},
  disabled: true,
});

export default defineComponent({
  components: {
    ContextMenu,
  },

  setup(_, { root, emit }) {
    const isLoading = ref(false);

    const track = computed(() => root.$getters()['playback/currentTrack']);
    const addItemToQueue = computed(() => useAddItemToQueueMenu(root, unref(track)));
    const artistPage = computed(() => useArtistLinkMenu(root, unref(track), {
      left: true,
      right: false,
    }));
    const releasePage = computed(() => useReleaseLinkMenu(root, unref(track)));

    const saveTrack = computed<App.MenuItem<'custom'>>(() => {
      const item = unref(track);
      return item != null
        ? {
          type: 'custom',
          name: item.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
          handler: () => {
            emit(ON_FAVORITE_MENU_CLICKED, !item.isSaved);
          },
        }
        : emptyMenuItem('お気に入りに追加');
    });

    const addItemToPlaylist = computed<App.MenuItem<'custom' | 'component', AddItemToPlaylistMenuProps>>(() => {
      const item = unref(track);
      return item != null
        ? {
          type: 'component',
          component: AddItemToPlaylistMenu,
          props: {
            name: item.name,
            uriList: [item.uri],
            artists: item.artists,
            left: true,
          },
        }
        : emptyMenuItem('プレイリストに追加');
    });

    const share = computed<App.MenuItem<'custom' | 'component', ShareMenuProps>>(() => {
      const item = unref(track);
      return item != null
        ? {
          type: 'component',
          component: ShareMenu,
          props: {
            name: item.name,
            uri: item.uri,
            url: `/releases/${item.releaseId}`,
            typeName: '曲',
            artists: item.artists,
            externalUrls: item.externalUrls,
            left: true,
          },
        }
        : emptyMenuItem('シェア');
    });

    const updatePlayback = computed<App.MenuItem<'custom'>>(() => {
      return {
        type: 'custom',
        name: 'プレイヤーの情報を更新',
        handler: () => {
          isLoading.value = true;
          Promise.all([
            root.$dispatch('playback/getCurrentPlayback'),
            root.$dispatch('playback/getDeviceList'),
          ]).then(() => {
            isLoading.value = false;
          });
        },
      };
    });

    const menuGroups = computed<App.MenuItemGroup[]>(() => [
      [unref(addItemToQueue)],
      [unref(artistPage), unref(releasePage)],
      [unref(saveTrack), unref(addItemToPlaylist)],
      [unref(share)],
      [unref(updatePlayback)],
    ]);

    return {
      isLoading,
      menuGroups,
    };
  },
});
</script>
