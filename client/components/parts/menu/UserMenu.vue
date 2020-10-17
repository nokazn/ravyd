<template>
  <ContextMenu
    bottom
    offset-y
    :fab="fab"
    :groups="menuItemLists"
    :size="size"
    :outlined="outlined"
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import type { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean;
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    user: {
      type: Object as PropType<App.UserInfo>,
      required: true,
    },
    following: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
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
        disabled: this.following == null,
      };
    },
    share(): MenuItem<'component'> {
      const props: ShareMenuProps = {
        name: this.user.displayName ?? this.user.id,
        uri: this.user.uri,
        typeName: 'ユーザー',
        artists: undefined,
        externalUrls: this.user.externalUrls,
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
      return this.following != null
        ? [
          [this.followArtist],
          [this.share],
        ]
        : [
          [this.share],
        ];
    },
  },
});
</script>
