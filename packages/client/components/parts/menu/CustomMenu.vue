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
    :z-index="$constant.Z_INDEX_OF.menu"
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
      :color="$constant.MENU_BACKGROUND_COLOR"
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
import { defineComponent, computed, PropType } from '@vue/composition-api';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
};

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
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
  },

  setup(props, { emit }) {
    const menu = computed<boolean>({
      get() { return props.value; },
      set(value) { emit(INPUT, value); },
    });

    return { menu };
  },
});
</script>

<style lang="scss" module>
.CustomMenu {
  min-width: 400px;
  max-width: min(500px, 80vw);
}
</style>
