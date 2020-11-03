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
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import type { App } from '~~/types';

const ON_SAVE_MENU_CLICKED = 'on-save-menu-clicked';

export type On = {
  [ON_SAVE_MENU_CLICKED]: boolean;
}

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    show: {
      type: Object as PropType<App.ShowPage>,
      required: true,
    },
    saved: {
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
    fab: {
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
    const saveShow = computed<App.MenuItem<'custom'>>(() => ({
      type: 'custom',
      name: props.saved ? '保存しない' : '保存する',
      handler: () => {
        emit(ON_SAVE_MENU_CLICKED, !props.saved);
      },
    }));

    const share: App.MenuItem<'component', ShareMenuProps> = {
      type: 'component',
      component: ShareMenu,
      props: {
        name: props.show.name,
        uri: props.show.uri,
        typeName: 'ポッドキャスト',
        artists: props.show.publisher,
        externalUrls: props.show.externalUrls,
        left: props.left,
        right: props.right,
      },
    };

    const menuGroups = computed<App.MenuItemGroup[]>(() => [
      [unref(saveShow)],
      [unref(share)],
    ]);

    return { menuGroups };
  },
});
</script>
