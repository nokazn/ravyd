<template>
  <ContextMenu
    bottom
    offset-y
    :groups="menuGroups"
    :size="size"
    :fab="fab"
    :outlined="outlined"
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  unref,
  PropType,
} from '@vue/composition-api';

import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import { useArtistLinkMenu, useAddItemToPlaylistMenu, useShareMenu } from '~/use/menu';
import type { App } from '~~/types';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: boolean
}

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    release: {
      type: Object as PropType<App.ReleasePage>,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root, emit }) {
    const artistPage = useArtistLinkMenu(root, props.release, {
      left: props.left,
      right: props.right,
    });
    const addItemToPlaylist = useAddItemToPlaylistMenu(props.release, {
      publisher: undefined,
      left: props.left,
      right: props.right,
    });
    const share = useShareMenu({
      name: props.release.name,
      uri: props.release.uri,
      typeName: 'アルバム',
      artists: props.release.artists,
      externalUrls: props.release.externalUrls,
      left: props.left,
      right: props.right,
    });

    const saveRelease = computed<App.MenuItem<'custom'>>(() => ({
      type: 'custom',
      name: props.release.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
      handler: () => {
        emit(ON_FAVORITE_MENU_CLICKED, !props.release.isSaved);
      },
    }));

    const menuGroups = computed<App.MenuItemGroup[]>(() => [
      [unref(artistPage)],
      [unref(saveRelease), unref(addItemToPlaylist)],
      [unref(share)],
    ]);

    return { menuGroups };
  },
});
</script>
