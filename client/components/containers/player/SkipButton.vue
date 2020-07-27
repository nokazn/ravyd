<template>
  <v-btn
    icon
    :disabled="disabled"
    :title="skipButton.title"
    @click="onClicked"
  >
    <v-icon :size="16">
      {{ skipButton.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

type SkipButton = {
  title: string
  icon: 'mdi-redo' | 'mdi-undo'
}

export default Vue.extend({
  props: {
    seconds: {
      type: Number,
      required: true,
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
      const positionMs = this.$state().playback.positionMs + this.seconds * 1000;
      this.$dispatch('playback/seek', {
        positionMs,
      });
    },
  },
});
</script>
