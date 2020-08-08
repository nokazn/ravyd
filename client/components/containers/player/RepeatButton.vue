<template>
  <v-btn
    icon
    :color="repeatButton.color"
    :title="repeatButton.title"
    :disabled="disabled"
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
  color: 'active-icon' | 'inactive'
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 20,
    },
  },

  computed: {
    repeatButton(): RepeatButton {
      switch (this.$state().playback.repeatMode) {
        case 1:
          return {
            icon: 'mdi-repeat',
            color: 'active-icon',
            title: '曲をリピート再生',
          };
        case 2:
          return {
            icon: 'mdi-repeat-once',
            color: 'active-icon',
            title: 'リピート再生しない',
          };
        default:
          return {
            icon: 'mdi-repeat-off',
            color: 'inactive',
            title: 'リピート再生',
          };
      }
    },
    disabled(): boolean {
      return this.$getters()['playback/isDisallowed']('toggling_repeat_context')
        || this.$getters()['playback/isDisallowed']('toggling_repeat_track');
    },
  },

  methods: {
    onClicked() {
      this.$dispatch('playback/repeat');
    },
  },
});
</script>
