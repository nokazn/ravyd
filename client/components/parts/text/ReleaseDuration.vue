<template>
  <span
    :title="duration.title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      v-if="!hideIcon"
      :size="iconSize"
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
import { defineComponent, computed } from '@vue/composition-api';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';

type Duration = {
  text: string
  title: string
}

export default defineComponent({
  props: {
    durationMs: {
      type: Number,
      required: true,
    },
    hasMore: {
      type: Boolean,
      default: false,
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
    const duration = computed<Duration>(() => {
      const elapsedTime = elapsedTimeInJapanese(props.durationMs);
      const text = props.hasMore
        ? `${elapsedTime} + α`
        : elapsedTime;
      return {
        text,
        title: `全${text}`,
      };
    });

    return {
      textStyles,
      iconSize,
      duration,
    };
  },
});
</script>
