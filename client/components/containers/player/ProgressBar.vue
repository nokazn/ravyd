<template>
  <v-progress-linear
    :color="color"
    background-color="inactive"
    :height="height"
    :value="progress"
    :class="$style.SeekBar__slider"
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

<style lang="scss" module>
.SeekBar {
  width: 100%;

  &__mss {
    font-size: 0.75em;
    margin-top: -0.5em;
    position: relative;

    & > * {
      position: absolute;
    }

    &--right {
      right: 0;
    }
  }
}
</style>

<style lang="scss">
.v-slider {
  &--horizontal {
    margin-left: var(--margin-side) !important;
    margin-right: var(--margin-side) !important;
  }
}
</style>
