<template>
  <div :class="$style.EpisodeProgressBar">
    <span
      v-if="text && remainingTime != null"
      :class="{
        ['subtext--text']: subtext,
        [$style.EpisodeProgressBar__text]: true,
      }"
      class="g-small-text"
    >
      {{ remainingTime }}
    </span>
    <v-progress-linear
      rounded
      color="grey lighten-4"
      :value="value"
      :title="title"
      :style="styles"
      :class="$style.EpisodeProgressBar__progress"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { SpotifyAPI } from 'shared/types';
import { elapsedTimeInJapanese } from '~~/utils/elapsedTimeInJapanese';
import { elapsedTime } from '~~/utils/elapsedTime';

export default defineComponent({
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
    subtext: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const remainingTime = computed(() => {
      if (props.resumePoint.fully_played) {
        return '再生済み';
      }
      const positionMs = props.resumePoint.resume_position_ms;
      const remainingMs = props.durationMs - positionMs;
      return positionMs > 0
        ? `残り${elapsedTimeInJapanese(remainingMs)}`
        : '未再生';
    });
    const title = computed(() => {
      if (props.resumePoint.fully_played) {
        return '再生済み';
      }
      const position = props.resumePoint.resume_position_ms;
      return position !== 0
        ? `${elapsedTime(position)}まで再生`
        : '未再生';
    });
    const value = computed(() => (props.resumePoint.resume_position_ms / props.durationMs) * 100);
    const styles = computed(() => ({
      maxWidth: props.maxWidth != null
        ? `${props.maxWidth}px`
        : undefined,
    }));

    return {
      remainingTime,
      title,
      value,
      styles,
    };
  },
});
</script>

<style lang="scss" module>
.EpisodeProgressBar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 12px;
  }

  &__text {
    flex-shrink: 0;
  }

  &__progress {
    // progress bar の方を縮ませる
    flex-shrink: 1;
  }
}
</style>
