<template>
  <v-menu
    v-model="menu"
    close-on-click
    close-on-content-click
    :top="top"
    :bottom="bottom"
    :left="left"
    :right="right"
    :nudge-top="nudgeTop"
    :nudge-bottom="nudgeBottom"
    :nudge-left="nudgeLeft"
    :nudge-right="nudgeRight"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :z-index="$constant.Z_INDEX_OF.menu"
    :open-on-hover="openOnHover && !$screen.isTouchScreen"
    :open-on-click="openOnClick"
    :close-delay="closeDelay"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>

    <v-list
      dense
      :elevation="12"
      :color="$constant.MENU_BACKGROUND_COLOR"
    >
      <slot />
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';

export default defineComponent({
  props: {
    top: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    bottom: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    left: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    right: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    nudgeTop: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    nudgeBottom: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    nudgeLeft: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    nudgeRight: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    offsetX: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    offsetY: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    origin: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    openOnHover: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    openOnClick: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    closeDelay: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  setup() {
    const menu = ref(false);
    return { menu };
  },
});
</script>
