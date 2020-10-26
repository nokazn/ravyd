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
import {
  defineComponent,
  computed,
  unref,
  PropType,
} from '@vue/composition-api';

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import type { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean;
}

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    user: {
      type: Object as PropType<App.UserPage>,
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

  setup(props, { emit }) {
    const followArtist = computed<MenuItem<'custom'>>(() => {
      return {
        type: 'custom',
        name: props.following ? 'フォローしない' : 'フォローする',
        handler: () => { emit(ON_FOLLOW_MENU_CLICKED, !props.following); },
        disabled: props.following == null,
      };
    });

    const share = computed<MenuItem<'component', ShareMenuProps>>(() => ({
      type: 'component',
      component: ShareMenu,
      props: {
        name: props.user.displayName ?? props.user.id,
        uri: props.user.uri,
        typeName: 'ユーザー',
        artists: undefined,
        externalUrls: props.user.externalUrls,
        left: props.left,
        right: props.right,
      },
    }));

    const menuItemLists = computed<Group[]>(() => {
      return props.following != null
        ? [
          [unref(followArtist)],
          [unref(share)],
        ]
        : [
          [unref(share)],
        ];
    });

    return { menuItemLists };
  },
});
</script>
