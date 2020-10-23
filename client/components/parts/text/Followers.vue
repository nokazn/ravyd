<template>
  <span
    :title="text"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="iconSize"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-account-multiple
    </v-icon>
    <span :style="textStyles">
      {{ text }}
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 13,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const textStyles = { fontSize: `${props.size}px` };
    const iconSize = Math.floor(props.size * 1.25);

    return {
      textStyles,
      iconSize,
    };
  },
});
</script>
