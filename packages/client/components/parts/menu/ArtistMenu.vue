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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import { useShareMenu } from '~/use/menu';
import type { App } from '~/entities';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean;
};

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    artist: {
      type: Object as PropType<App.ArtistPage>,
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
    const menuGroups = computed<App.MenuItemGroup[]>(() => {
      const followArtist: App.MenuItem<'custom'> = {
        type: 'custom',
        name: props.following ? 'フォローしない' : 'フォローする',
        handler: () => {
          emit(ON_FOLLOW_MENU_CLICKED, !props.following);
        },
      };
      const share = useShareMenu({
        name: props.artist.name,
        uri: props.artist.uri,
        typeName: 'アーティスト',
        artists: undefined,
        externalUrls: props.artist.externalUrls,
        left: props.left,
        right: props.right,
      });

      return [
        [followArtist],
        [share],
      ];
    });

    return { menuGroups };
  },
});
</script>
