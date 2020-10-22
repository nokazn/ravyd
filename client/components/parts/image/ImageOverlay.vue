<template>
  <v-overlay
    v-if="!$screen.isTouchScreen"
    v-show="hover"
    absolute
    :opacity="0.7"
  >
    <v-hover v-slot="{ hover: buttonHoverd }">
      <v-btn
        icon
        @click.stop.prevent="onClick"
      >
        <v-icon
          :size="iconSize(buttonHoverd)"
          :class="$style.ImageOverlay__icon"
        >
          {{ icon }}
        </v-icon>
      </v-btn>
    </v-hover>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
}

export default defineComponent({
  props: {
    hover: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    icon: {
      type: String,
      required: true,
    },
  },

  emits: {
    [CLICK]: null,
  },

  setup(props, { emit }) {
    const iconSize = (hover: boolean): number => {
      const ratio = hover
        ? 0.375
        : 0.3;
      const maxSize = 180;

      return props.size == null || props.size < maxSize
        ? maxSize * ratio
        : props.size * ratio;
    };
    const onClick = () => { emit(CLICK); };

    return {
      iconSize,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.ImageOverlay {
  &__icon {
    cursor: pointer;
  }
}
</style>
