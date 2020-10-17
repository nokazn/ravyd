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
import Vue, { PropType } from 'vue';

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean;
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

  computed: {
    followArtist(): MenuItem<'custom'> {
      return {
        type: 'custom',
        name: this.following ? 'フォローしない' : 'フォローする',
        handler: () => {
          const nextFollowingState = !this.following;
          this.$emit(ON_FOLLOW_MENU_CLICKED, nextFollowingState);
        },
      };
    },
    share(): MenuItem<'component'> {
      const props: ShareMenuProps = {
        name: this.artist.name,
        uri: this.artist.uri,
        typeName: 'アーティスト',
        artists: undefined,
        externalUrls: this.artist.externalUrls,
        left: this.left,
        right: this.right,
      };
      return {
        type: 'component',
        component: ShareMenu,
        props,
      };
    },
    menuItemLists(): Group[] {
      return [
        [this.followArtist],
        [this.share],
      ];
    },
  },
});
</script>
