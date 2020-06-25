<template>
  <span
    :title="duration.title"
    class="subtext--text"
  >
    <v-icon
      :size="size"
      color="subtext"
    >
      mdi-clock-outline
    </v-icon>

    <span :style="textStyles">
      {{ duration.text }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';

type Duration = {
  text: string
  title: string
}

export type Data = {
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    durationMs: {
      type: Number,
      required: true,
    },
    isFull: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },

  data(): Data {
    const textStyles = { fontSize: `${this.size * 0.8}px` };

    return {
      textStyles,
    };
  },

  computed: {
    duration(): { text: string, title: string } {
      const elapsedTime = elapsedTimeInJapanese(this.durationMs);
      const text = this.isFull
        ? elapsedTime
        : `${elapsedTime} + α`;

      return {
        text,
        title: `全${text}`,
      };
    },
  },
});
</script>
