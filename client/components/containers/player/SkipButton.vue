<template>
  <CircleButton
    :size="size"
    :disabled="disabled"
    :title="skipButton.title"
    @click="onClicked"
  >
    {{ skipButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type SkipButton = {
  title: string
  icon: 'mdi-redo' | 'mdi-undo'
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    seconds: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
  },

  computed: {
    skipButton(): SkipButton {
      const seconds = Math.abs(this.seconds);
      const skipText = this.seconds > 0
        ? '進む'
        : '戻す';
      const icon = this.seconds > 0
        ? 'mdi-redo'
        : 'mdi-undo';

      return {
        title: `${seconds}秒${skipText}`,
        icon,
      };
    },
    disabled(): boolean {
      return this.$getters()['playback/isDisallowed']('seeking');
    },
  },

  methods: {
    onClicked() {
      const milliSeconds = this.seconds * 1000;
      const positionMs = this.$state().playback.positionMs + milliSeconds;
      // 戻る
      if (milliSeconds < 0) {
        this.$dispatch('playback/seek', {
          positionMs: Math.max(positionMs, 0),
        });
        return;
      }

      if (positionMs < this.$state().playback.durationMs) {
        // 進む
        this.$dispatch('playback/seek', { positionMs });
      } else {
        // 次の曲
        this.$dispatch('playback/next');
      }
    },
  },
});
</script>
