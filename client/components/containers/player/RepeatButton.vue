<template>
  <CircleButton
    :disabled="disabled"
    :size="size"
    :icon-size-ratio="0.5"
    :icon-color="repeatButton.color"
    :title="repeatButton.title"
    @click="onClicked"
  >
    {{ repeatButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export type RepeatButton = {
  icon: 'mdi-repeat-off' | 'mdi-repeat' | 'mdi-repeat-once'
  title: 'リピート再生しない' | 'リピート再生' | '曲をリピート再生'
  color: 'active-icon' | 'inactive'
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 32,
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
