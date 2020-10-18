<template>
  <v-btn
    :width="size"
    :height="size"
    :color="fab ? color : undefined"
    :fab="fab"
    :icon="!fab"
    :outlined="outlined"
    :absolute="absolute"
    :disabled="disabled"
    @click="onClick"
  >
    <v-icon
      :size="adjustedIconSize"
      :color="iconColor"
    >
      <slot />
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
}

export default defineComponent({
  props: {
    size: {
      type: Number,
      default: 36,
    },
    iconSize: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    iconSizeRatio: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    color: {
      type: String,
      default: 'grey darken-3',
    },
    iconColor: {
      type: String,
      default: undefined,
    },
    fab: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    [CLICK]: null,
  },

  setup(props, { emit }) {
    const adjustedIconSize = computed((): number => {
      const ratio = props.iconSizeRatio ?? props.outlined ? 0.8 : 1;
      return props.iconSize ?? Math.floor((props.size * ratio) / Math.SQRT2);
    });
    const onClick = () => { emit(CLICK); };

    return {
      adjustedIconSize,
      onClick,
    };
  },
});
</script>
