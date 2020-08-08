<template>
  <v-btn
    icon
    :color="shuffleButton.color"
    :disabled="disabled"
    :title="shuffleButton.title"
    @click="onClicked"
  >
    <v-icon :size="size">
      mdi-shuffle-variant
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type ShuffleButton = {
  color: 'active-icon' | 'inactive',
  title: 'シャッフル再生' | 'シャッフル再生しない'
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 20,
    },
  },

  computed: {
    shuffleButton(): ShuffleButton {
      return this.$state().playback.isShuffled
        ? {
          color: 'active-icon',
          title: 'シャッフル再生しない',
        }
        : {
          color: 'inactive',
          title: 'シャッフル再生',
        };
    },
    disabled(): boolean {
      return this.$getters()['playback/isDisallowed']('toggling_shuffle');
    },
  },

  methods: {
    onClicked() {
      this.$dispatch('playback/shuffle');
    },
  },
});
</script>
