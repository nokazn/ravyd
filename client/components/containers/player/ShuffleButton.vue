<template>
  <CircleButton
    :disabled="disabled"
    :size="size"
    :icon-size-ratio="0.5"
    :icon-color="shuffleButton.color"
    :title="shuffleButton.title"
    @click="onClicked"
  >
    mdi-shuffle-variant
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export type ShuffleButton = {
  color: 'active-icon' | 'inactive',
  title: 'シャッフル再生' | 'シャッフル再生しない'
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
