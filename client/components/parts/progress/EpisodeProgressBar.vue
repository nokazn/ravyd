<template>
  <div :class="$style.EpisodeProgressBar">
    <span
      v-if="text && remainingTime != null"
      class="subtext--text"
    >
      {{ remainingTime }}
    </span>
    <v-progress-linear
      rounded
      color="grey lighten-4"
      :value="value"
      :title="title"
      :style="styles"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { elapsedTime } from '~~/utils/elapsedTime';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  props: {
    resumePoint: {
      type: Object as PropType<SpotifyAPI.ResumePoint>,
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    text: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  computed: {
    remainingTime(): string {
      const positionMs = this.resumePoint.resume_position_ms;
      const remainingMs = this.durationMs - positionMs;
      return positionMs > 0
        ? `残り${elapsedTimeInJapanese(remainingMs)}`
        : '未再生';
    },
    title(): string {
      const position = this.resumePoint.resume_position_ms;
      return position !== 0
        ? `${elapsedTime(position)}まで再生`
        : '未再生';
    },
    value(): number {
      return (this.resumePoint.resume_position_ms / this.durationMs) * 100;
    },
    styles(): { maxWidth: string | undefined } {
      return {
        maxWidth: this.maxWidth != null
          ? `${this.maxWidth}px`
          : undefined,
      };
    },
  },
});
</script>

<style lang="scss" module>
.EpisodeProgressBar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
