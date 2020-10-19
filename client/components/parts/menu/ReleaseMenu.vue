<template>
  <ContextMenu
    bottom
    offset-y
    :groups="menuItemLists"
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

import ContextMenu, { Group, MenuItem, MenuType } from '~/components/parts/menu/ContextMenu.vue';
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

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
      type: Object as PropType<App.ReleaseInfo>,
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
    const artistPage = computed<MenuItem<MenuType, ArtistLinkMenuProps>>(() => {
      const { artists } = props.release;
      const { length } = artists;
      const name = 'アーティストページに移動';
      if (length === 0) {
        return {
          type: 'custom',
          name,
          handler: () => {},
          disabled: true,
        };
      }
      //  アーティストが複数の時
      if (length > 1) {
        return {
          type: 'component',
          component: ArtistLinkMenu,
          props: {
            artists,
            left: props.left,
            right: props.right,
          },
        };
      }
      // アーティストが一組の時
      const artistId = artists[0].id;
      return {
        type: 'to',
        name: 'アーティストページに移動',
        to: `/artists/${artistId}`,
        disabled: root.$route.params.artistId === artistId,
      };
    });

    const saveRelease = computed<MenuItem<'custom'>>(() => ({
      type: 'custom',
      name: props.release.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
      handler: () => { emit(ON_FAVORITE_MENU_CLICKED, !props.release.isSaved); },
    }));

    const addItemToPlaylist = computed<MenuItem<'component', AddItemToPlaylistMenuProps>>(() => ({
      type: 'component',
      component: AddItemToPlaylistMenu,
      props: {
        name: props.release.name,
        uriList: props.release.trackList.map((track) => track.uri),
        artists: props.release.artists,
        left: props.left,
        right: props.right,
      },
    }));

    const share = computed<MenuItem<'component', ShareMenuProps>>(() => ({
      type: 'component',
      component: ShareMenu,
      props: {
        name: props.release.name,
        uri: props.release.uri,
        typeName: 'アルバム',
        artists: props.release.artists,
        externalUrls: props.release.externalUrls,
        left: props.left,
        right: props.right,
      },
    }));

    const menuItemLists = computed<Group[]>(() => [
      [unref(artistPage)],
      [unref(saveRelease), unref(addItemToPlaylist)],
      [unref(share)],
    ]);

    return { menuItemLists };
  },
});
</script>
