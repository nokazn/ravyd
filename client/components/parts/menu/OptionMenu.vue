<template>
  <v-menu
    v-model="menu"
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
    :z-index="Z_INDEX"
    :open-on-hover="openOnHover"
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
      :color="MENU_BACKGROUND_COLOR"
    >
      <slot />
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
  isShown: boolean;
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
    openOnHover: {
      type: Boolean,
      default: false,
    },
    openOnClick: {
      type: Boolean,
      default: false,
    },
    closeDelay: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    value: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    return {
      isShown: false,
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    menu: {
      get(): boolean {
        return this.value ?? this.isShown;
      },
      set(menu: boolean) {
        if (this.value != null) {
          this.$emit(INPUT, menu);
        } else {
          this.isShown = menu;
        }
      },
    },
  },
});
</script>
