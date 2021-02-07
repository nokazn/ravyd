<template>
  <ContextMenu
    bottom
    offset-y
    :fab="fab"
    :groups="menuGroups"
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

import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import { useShareMenu } from '~/use/menu';
import type { App } from '~/entities';

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
    const followArtist = computed<App.MenuItem<'custom'>>(() => {
      return {
        type: 'custom',
        name: props.following ? 'フォローしない' : 'フォローする',
        handler: () => {
          emit(ON_FOLLOW_MENU_CLICKED, !props.following);
        },
        disabled: props.following == null,
      };
    });

    const share = useShareMenu({
      name: props.user.displayName ?? props.user.id,
      uri: props.user.uri,
      typeName: 'ユーザー',
      artists: undefined,
      externalUrls: props.user.externalUrls,
      left: props.left,
      right: props.right,
    });

    const menuGroups = computed<App.MenuItemGroup[]>(() => {
      return props.following != null
        ? [
          [unref(followArtist)],
          [unref(share)],
        ]
        : [
          [unref(share)],
        ];
    });

    return { menuGroups };
  },
});
</script>
