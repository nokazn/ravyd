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

import ContextMenu, { Group } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_SAVE_MENU_CLICKED = 'on-save-menu-clicked';

export type On = {
  [ON_SAVE_MENU_CLICKED]: boolean
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    show: {
      type: Object as PropType<App.ShowInfo>,
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

  computed: {
    menuItemLists(): Group[] {
      const saveShow = () => {
        const nextSavedState = !this.saved;
        const handler = () => {
          this.$emit(ON_SAVE_MENU_CLICKED, nextSavedState);
        };

        return {
          name: nextSavedState ? '保存する' : '保存しない',
          handler,
        };
      };

      const share = () => {
        const props: ShareMenuProps = {
          name: this.show.name,
          uri: this.show.uri,
          typeName: 'ポッドキャスト',
          artists: this.show.publisher,
          externalUrls: this.show.externalUrls,
          left: this.left,
          right: this.right,
        };
        return {
          component: ShareMenu,
          props,
        };
      };

      return [
        [saveShow()],
        [share()],
      ];
    },
  },
});
</script>
