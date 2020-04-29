<template>
  <div :class="$style.MediaControler">
    <v-btn
      icon
      :color="shuffleColor"
      :disabled="isShuffleDisallowed"
      @click="onShuffleClicked">
      <v-icon :size="16">
        mdi-shuffle-variant
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      :disabled="isPreviousDisallowed"
      @click="onPreivousClicked"
      @dblclick="onPreviousDoubleClicked">
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
      :disabled="isRepeatDisallowed"
      @click="onRepeatClicked">
      <v-icon :size="16">
        {{ repeatIcon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'vuex';

export default Vue.extend({
  computed: {
    position(): RootState['player']['position'] {
      return this.$state().player.position;
    },

    mediaButton(): 'mdi-play-circle' | 'mdi-pause-circle' {
      return this.$state().player.isPlaying
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },

    isPreviousDisallowed(): boolean {
      return this.$getters()['player/isPreviousDisallowed'] && this.position < 1000;
    },

    isShuffleDisallowed(): RootGetters['player/isShuffleDisallowed'] {
      return this.$getters()['player/isShuffleDisallowed'];
    },
    shuffleColor(): string {
      if (this.isShuffleDisallowed) return 'grey darken2';

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
    isRepeatDisallowed(): boolean {
      return this.$getters()['player/isRepeatContextDisallowed']
        || this.$getters()['player/isRepeatTrackDisallowed'];
    },
    repeatColor(): string {
      if (this.isRepeatDisallowed) return 'grey-darken-2';

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
      // position が 0:01 未満のときに前の曲に戻る
      if (this.position < 1000) {
        this.$dispatch('player/previous');
      } else {
        this.$dispatch('player/seek', 0);
      }
    },
    onPreviousDoubleClicked() {
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
