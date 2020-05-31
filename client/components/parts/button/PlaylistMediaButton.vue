<template>
  <v-btn
    icon
    @click="onClick"
  >
    <v-icon :title="mediaButton.title">
      {{ mediaButton.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type MediaButton = {
  icon: 'mdi-play' | 'mdi-pause' | 'mdi-volume-high'
  title: '再生' | '停止' | '再生中'
}

export default Vue.extend({
  props: {
    isHovered: {
      type: Boolean,
      required: true,
    },
    isPlayingTrack: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      if (!this.isPlayingTrack) {
        return {
          icon: 'mdi-play',
          title: '再生',
        };
      }

      return this.isHovered
        ? {
          icon: 'mdi-pause',
          title: '停止',
        }
        : {
          icon: 'mdi-volume-high',
          title: '再生中',
        };
    },
  },

  methods: {
    onClick() {
      this.$emit('on-clicked');
    },
  },
});
</script>
