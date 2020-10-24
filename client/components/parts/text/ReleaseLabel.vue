<template>
  <span
    :title="title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="iconSize"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-album
    </v-icon>
    <span :style="textStyles">
      {{ label }}
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 13,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const title = `レーベル - ${props.label}`;
    const iconSize = Math.floor(props.size * 1.25);
    const textStyles = { fontSize: `${props.size}px` };

    return {
      title,
      iconSize,
      textStyles,
    };
  },
});
</script>
