<template>
  <v-menu
    v-model="menu"
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :offset-x="offsetX"
    :offset-y="offsetY"
    rounded="lg"
    :z-index="Z_INDEX"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>

    <v-list
      dense
      nav
      :elevation="12"
      subheader
      :color="MENU_BACKGROUND_COLOR"
      :class="$style.CustomMenu"
    >
      <slot name="header" />

      <v-divider />

      <slot />

      <v-divider v-if="$slots.footer != null" />

      <slot name="footer" />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/constants';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

type Data = {
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR;
  Z_INDEX: number;
}

export default Vue.extend({
  props: {
    top: {
      type: Boolean,
      default: false,
    },
    bottom: {
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
    offsetX: {
      type: Boolean,
      default: false,
    },
    offsetY: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    menu: {
      get(): boolean {
        return this.value;
      },
      set(menu: boolean) {
        this.$emit(INPUT, menu);
      },
    },
  },
});
</script>

<style lang="scss" module>
.CustomMenu {
  min-width: 400px;
  max-width: min(500px, 80vw);
}
</style>
