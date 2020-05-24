<template>
  <div :class="$style.MediaControler">
    <v-btn
      icon
      :disabled="isShuffleDisallowed"
      :color="shuffleButton.color"
      :title="shuffleButton.title"
      @click="onShuffleClicked">
      <v-icon :size="16">
        mdi-shuffle-variant
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      :disabled="isPreviousDisallowed"
      title="前の曲"
      @click="onPreivousClicked"
      @dblclick="onPreviousDoubleClicked">
      <v-icon :size="28">
        mdi-skip-previous
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      :title="mediaButton.title"
      @click="onMediaClicked">
      <v-icon :size="40">
        {{ mediaButton.icon }}
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large
      title="次の曲"
      @click="onNextClicked">
      <v-icon :size="28">
        mdi-skip-next
      </v-icon>
    </v-btn>

    <v-btn
      icon
      :color="repeatButton.color"
      :title="repeatButton.title"
      :disabled="isRepeatDisallowed"
      @click="onRepeatClicked">
      <v-icon :size="16">
        {{ repeatButton.icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, RootGetters } from 'vuex';

export type MediaButton = {
  icon: 'mdi-play-circle' | 'mdi-pause-circle'
  title: '再生' | '停止'
}

export type ShuffleButton = {
  color: 'cyan' | 'grey lighten-1',
  title: 'シャッフル再生' | 'シャッフル再生しない'
};

export type RepeatButton = {
  icon: 'mdi-repeat-off' | 'mdi-repeat' | 'mdi-repeat-once'
  title: 'リピート再生しない' | 'リピート再生' | '曲をリピート再生'
  color: 'cyan' | 'grey lighten-1'
}

export default Vue.extend({
  computed: {
    position(): RootState['player']['position'] {
      return this.$state().player.position;
    },

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

    isPreviousDisallowed(): boolean {
      return this.$getters()['player/isPreviousDisallowed'] && this.position < 1000;
    },

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

    repeatButton(): RepeatButton {
      switch (this.$state().player.repeatMode) {
        case 0:
          return {
            icon: 'mdi-repeat-off',
            color: 'grey lighten-1',
            title: 'リピート再生',
          };
        case 1:
          return {
            icon: 'mdi-repeat',
            color: 'cyan',
            title: '曲をリピート再生',
          };
        default:
          return {
            icon: 'mdi-repeat-once',
            color: 'cyan',
            title: 'リピート再生しない',
          };
      }
    },
    isRepeatDisallowed(): boolean {
      return this.$getters()['player/isRepeatContextDisallowed']
        || this.$getters()['player/isRepeatTrackDisallowed'];
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
  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
