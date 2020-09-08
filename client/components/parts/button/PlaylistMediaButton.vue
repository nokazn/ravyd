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

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  props: {
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

      return {
        icon: 'mdi-pause',
        title: '停止',
      };
    },
  },

  methods: {
    onClick() {
      this.$emit(ON_CLICKED);
    },
  },
});
</script>
