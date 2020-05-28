<template>
  <v-btn
    icon
    :color="repeatButton.color"
    :title="repeatButton.title"
    :disabled="isRepeatDisallowed"
    @click="onClicked"
  >
    <v-icon :size="size">
      {{ repeatButton.icon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type RepeatButton = {
  icon: 'mdi-repeat-off' | 'mdi-repeat' | 'mdi-repeat-once'
  title: 'リピート再生しない' | 'リピート再生' | '曲をリピート再生'
  color: 'cyan' | 'grey lighten-1'
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 16,
    },
  },

  computed: {
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
    onClicked() {
      this.$dispatch('player/repeat');
    },
  },
});
</script>
