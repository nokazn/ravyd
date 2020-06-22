<template>
  <span
    :title="title"
    :class="$style.TrackDuration"
  >
    {{ duration }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { elapsedTime } from '~~/utils/elapsedTime';

export type Data = {
  duration: string
  title: string
}

export default Vue.extend({
  props: {
    durationMs: {
      type: Number,
      required: true,
    },
  },

  data(): Data {
    const duration = elapsedTime(this.durationMs);
    const title = elapsedTimeInJapanese(this.durationMs);

    return {
      duration,
      title,
    };
  },
});
</script>

<style lang="scss" module>
.TrackDuration {
  font-size: 0.75rem;
}
</style>
