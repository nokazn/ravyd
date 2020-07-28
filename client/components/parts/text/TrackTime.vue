<template>
  <span
    :title="title"
    :class="$style.TrackTime"
  >
    {{ time }}
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { elapsedTime } from '~~/utils/elapsedTime';

export default Vue.extend({
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

  computed: {
    time() {
      return elapsedTime(this.timeMs);
    },
    title() {
      return elapsedTimeInJapanese(this.timeMs);
    },
  },
});
</script>

<style lang="scss" module>
.TrackTime {
  font-size: 0.75rem;
}
</style>
