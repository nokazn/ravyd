<template>
  <span
    :title="title"
    :class="$style.TrackTime"
  >
    {{ time }}
  </span>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { elapsedTime } from '~~/utils/elapsedTime';

export default defineComponent({
  props: {
    timeMs: {
      type: Number,
      required: true,
    },
    format: {
      type: String as PropType<'mss' | 'hmmss'>,
      default: 'mss',
    },
  },

  setup(props) {
    const time = computed(() => elapsedTime(props.timeMs));
    const title = computed(() => elapsedTimeInJapanese(props.timeMs));

    return {
      time,
      title,
    };
  },
});
</script>

<style lang="scss" module>
.TrackTime {
  font-size: 0.75rem;
}
</style>
