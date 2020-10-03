<template>
  <span
    :title="duration.title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="size * 1.25"
      :color="subtext ? 'subtext' : undefined"
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
    hasMore: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 14,
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

  data(): Data {
    const textStyles = { fontSize: `${this.size}px` };
    return {
      textStyles,
    };
  },

  computed: {
    duration(): { text: string, title: string } {
      const elapsedTime = elapsedTimeInJapanese(this.durationMs);
      const text = this.hasMore
        ? `${elapsedTime} + α`
        : elapsedTime;

      return {
        text,
        title: `全${text}`,
      };
    },
  },
});
</script>
