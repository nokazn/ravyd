<template>
  <CircleButton
    :size="size"
    :icon-size="iconSize"
    :title="mediaButton.title"
    @click="onClicked"
  >
    {{ mediaButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export type MediaButton = {
  icon: 'mdi-play-circle' | 'mdi-pause-circle' | 'mdi-play' | 'mdi-pause';
  title: '再生' | '停止';
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      const { circle } = this;
      if (this.$state().playback.isPlaying) {
        return {
          icon: circle ? 'mdi-pause-circle' : 'mdi-pause',
          title: '停止',
        };
      }
      return {
        icon: circle ? 'mdi-play-circle' : 'mdi-play',
        title: '再生',
      };
    },
    iconSize(): number {
      return this.circle
        ? this.size
        : this.size * 0.75;
    },
  },

  methods: {
    onClicked() {
      if (this.$state().playback.isPlaying) {
        this.$dispatch('playback/pause');
      } else {
        this.$dispatch('playback/play');
      }
    },
  },
});
</script>
