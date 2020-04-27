<template>
  <div :class="$style.MediaControler">
    <v-btn
      icon
      :color="shuffleColor"
      @click="onShuffleClicked">
      <v-icon :size="20">
        mdi-shuffle-variant
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      @click="onPreivousClicked">
      <v-icon :size="28">
        mdi-skip-previous
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      @click="onMediaClicked">
      <v-icon :size="40">
        {{ mediaButton }}
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      @click="onNextClicked">
      <v-icon :size="28">
        mdi-skip-next
      </v-icon>
    </v-btn>

    <v-btn
      icon
      :color="repeatColor"
      @click="onRepeatClicked">
      <v-icon :size="20">
        {{ repeatIcon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    mediaButton(): 'mdi-play-circle' | 'mdi-pause-circle' {
      return this.$state().player.isPlaying
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
    shuffleColor(): string {
      return this.$state().player.isShuffled
        ? 'success'
        : 'grey lighten-1';
    },
    repeatIcon(): string {
      switch (this.$state().player.repeatMode) {
        case 0:
          return 'mdi-repeat-off';
        case 1:
          return 'mdi-repeat-once';
        default:
          return 'mdi-repeat';
      }
    },
    repeatColor(): string {
      switch (this.$state().player.repeatMode) {
        case 0:
          return 'grey lighten-1';
        default:
          return 'success';
      }
    },
  },

  methods: {
    onShuffleClicked() {
      this.$dispatch('player/shuffle');
    },
    onPreivousClicked() {
      this.$dispatch('player/previous');
    },
    onMediaClicked() {
      if (this.$state().player.isPlaying) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play');
      }
    },
    onNextClicked() {
      this.$dispatch('player/next');
    },
    onRepeatClicked() {
      this.$dispatch('player/repeat');
    },
  },
});
</script>

<style lang="scss" module>
.MediaControler {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -16px;
  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
