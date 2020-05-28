<template>
  <v-btn
    icon
    large
    :title="mediaButton.title"
    @click="onClicked"
  >
    <v-icon :size="size">
      {{ mediaButton.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type MediaButton = {
  icon: 'mdi-play-circle' | 'mdi-pause-circle'
  title: '再生' | '停止'
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 40,
    },
  },

  computed: {
    mediaButton(): MediaButton {
      return this.$state().player.isPlaying
        ? {
          icon: 'mdi-pause-circle',
          title: '停止',
        }
        : {
          icon: 'mdi-play-circle',
          title: '再生',
        };
    },
  },

  methods: {
    onClicked() {
      if (this.$state().player.isPlaying) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play');
      }
    },
  },
});
</script>
