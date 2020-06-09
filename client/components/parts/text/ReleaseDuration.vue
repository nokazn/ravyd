<template>
  <span
    :class="$style.ReleaseDate"
    :title="title"
  >
    <v-icon
      :size="size"
      color="subtext"
    >
      mdi-clock-outline
    </v-icon>
    <span :style="textStyles">
      {{ duration }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';

export type Data = {
  duration: string
  title: string
  textStyles: { fontSize: string }
}

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

  data(): Data {
    const duration = elapsedTimeInJapanese(this.durationMs);
    const title = `全${duration}`;
    const textStyles = { fontSize: `${this.size * 0.8}px` };

    return {
      duration,
      title,
      textStyles,
    };
  },
});
</script>

<style lang="scss" module>
.ReleaseDate {
  color: $g-subtitle-color;
}
</style>
