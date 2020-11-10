<template>
  <v-progress-linear
    background-color="inactive"
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
      default: 2,
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
