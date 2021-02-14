<template>
  <CircleButton
    :size="size"
    :disabled="disabled"
    :icon-size-ratio="0.5"
    :icon-color="shuffleButton.color"
    :title="shuffleButton.title"
    @click="onClicked"
  >
    mdi-shuffle-variant
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type ShuffleButton = {
  color: 'active-icon' | 'inactive',
  title: 'シャッフル再生' | 'シャッフル再生しない'
}

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 32,
    },
  },

  setup(_, { root }) {
    const shuffleButton = computed<ShuffleButton>(() => {
      return root.$state().playback.isShuffled
        ? {
          color: 'active-icon',
          title: 'シャッフル再生しない',
        }
        : {
          color: 'inactive',
          title: 'シャッフル再生',
        };
    });
    const disabled = computed(() => root.$getters()['playback/isDisallowed']('toggling_shuffle'));

    const onClicked = () => { root.$dispatch('playback/shuffle'); };

    return {
      shuffleButton,
      disabled,
      onClicked,
    };
  },
});
</script>
