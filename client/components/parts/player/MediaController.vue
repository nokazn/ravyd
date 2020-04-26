<template>
  <div :class="$style.MediaControler">
    <v-btn
      icon
      color="grey lighten-1">
      <v-icon :size="16">
        mdi-shuffle-variant
      </v-icon>
    </v-btn>

    <v-btn
      icon
      large>
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
      large>
      <v-icon :size="28">
        mdi-skip-next
      </v-icon>
    </v-btn>

    <v-btn
      icon
      color="grey lighten-1">
      <v-icon :size="16">
        mdi-repeat
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
  },

  methods: {
    onMediaClicked() {
      if (this.$state().player.isPlaying) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play');
      }
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
