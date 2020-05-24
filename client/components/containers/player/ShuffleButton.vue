<template>
  <v-btn
    icon
    :disabled="isShuffleDisallowed"
    :color="shuffleButton.color"
    :title="shuffleButton.title"
    @click="onClicked">
    <v-icon :size="16">
      mdi-shuffle-variant
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

export type ShuffleButton = {
  color: 'cyan' | 'grey lighten-1',
  title: 'シャッフル再生' | 'シャッフル再生しない'
}

export default Vue.extend({
  computed: {
    shuffleButton(): ShuffleButton {
      return this.$state().player.isShuffled
        ? {
          color: 'cyan',
          title: 'シャッフル再生しない',
        }
        : {
          color: 'grey lighten-1',
          title: 'シャッフル再生',
        };
    },
    isShuffleDisallowed(): RootGetters['player/isShuffleDisallowed'] {
      return this.$getters()['player/isShuffleDisallowed'];
    },
  },

  methods: {
    onClicked() {
      this.$dispatch('player/shuffle');
    },
  },
});
</script>
