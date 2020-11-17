<template>
  <v-progress-linear
    background-color="inactive"
    :background-opacity="0.2"
    :height="height"
    :color="color"
    :value="progress"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useSeekBar } from '~/use/player';

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 1.8,
    },
  },

  setup(_, { root }) {
    const { progress, durationMs, color } = useSeekBar(root);

    return {
      progress,
      durationMs,
      color,
    };
  },
});
</script>
