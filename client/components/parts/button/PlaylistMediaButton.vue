<template>
  <v-btn
    icon
    :disabled="disabled"
    :title="mediaButton.title"
    @click="onClick"
  >
    <v-icon>
      {{ mediaButton.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type MediaButton = {
  icon: 'mdi-play' | 'mdi-pause' | 'mdi-volume-high'
  title: '再生' | '停止' | '再生中' | '再生できない項目'
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      if (this.disabled) {
        return {
          icon: 'mdi-play',
          title: '再生できない項目',
        };
      }

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
