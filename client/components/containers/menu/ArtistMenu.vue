<template>
  <ContextMenu
    :item-lists="menuItemLists"
    :size="size"
    :outlined="outlined"
    offset-y
    bottom
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContextMenu, { MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    artist: {
      type: Object as PropType<App.ArtistInfo>,
      required: true,
    },
    isFollowing: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
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

  computed: {
    menuItemLists(): MenuItem[][] {
      const followArtist = () => ({
        name: this.isFollowing ? 'フォローしない' : 'フォローする',
        handler: () => {
          const nextFollowingState = !this.isFollowing;
          this.$emit(ON_FOLLOW_MENU_CLICKED, nextFollowingState);
        },
      });

      const share = () => {
        const props: ShareMenuProps = {
          name: this.artist.name,
          uri: this.artist.uri,
          typeName: 'アーティスト',
          externalUrls: this.artist.externalUrls,
          left: this.left,
          right: this.right,
        };
        return {
          component: ShareMenu,
          props,
        };
      };

      return [
        [followArtist()],
        [share()],
      ];
    },
  },
});
</script>
