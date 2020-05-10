<template>
  <span :class="$style.ReleaseDate">
    <v-icon
      :size="size"
      color="grey lighten-1">
      mdi-clock-outline
    </v-icon>
    <span :style="textStyles">
      {{ duration }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { elapsedTime } from '~~/utils/elapsedTime';

export default Vue.extend({
  props: {
    durationMs: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },

  computed: {
    duration(): string {
      return elapsedTime(this.durationMs);
    },
    textStyles(): { 'font-size': string } {
      return {
        'font-size': `${this.size * 0.8}px`,
      };
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseDate {
  color: $g-subtitle-color;
}
</style>
