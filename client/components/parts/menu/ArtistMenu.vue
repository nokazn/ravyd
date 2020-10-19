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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean;
}

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    artist: {
      type: Object as PropType<App.ArtistInfo>,
      required: true,
    },
    following: {
      type: Boolean,
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

  setup(props, { emit }) {
    const menuItemLists = computed<Group[]>(() => {
      const followArtist: MenuItem<'custom'> = {
        type: 'custom',
        name: props.following ? 'フォローしない' : 'フォローする',
        handler: () => { emit(ON_FOLLOW_MENU_CLICKED, !props.following); },
      };
      const share: MenuItem<'component', ShareMenuProps> = {
        type: 'component',
        component: ShareMenu,
        props: {
          name: props.artist.name,
          uri: props.artist.uri,
          typeName: 'アーティスト',
          artists: undefined,
          externalUrls: props.artist.externalUrls,
          left: props.left,
          right: props.right,
        },
      };
      return [
        [followArtist],
        [share],
      ];
    });

    return { menuItemLists };
  },
});
</script>
