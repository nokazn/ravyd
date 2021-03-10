<template>
  <CircleButton
    :size="size"
    :disabled="disabled"
    :icon-size-ratio="0.5"
    :icon-color="repeatButton.color"
    :title="repeatButton.title"
    @click="onClicked"
  >
    {{ repeatButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type RepeatButton = {
  icon: 'mdi-repeat-off' | 'mdi-repeat' | 'mdi-repeat-once';
  title: 'リピート再生しない' | 'リピート再生' | '曲をリピート再生';
  color: 'active-icon' | 'inactive';
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
    const repeatButton = computed<RepeatButton>(() => {
      switch (root.$getters()['playback/repeatMode']) {
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
    });
    const disabled = computed(() => root.$getters()['playback/isDisallowed']([
      'toggling_repeat_context',
      'toggling_repeat_track',
    ]));

    const onClicked = () => { root.$dispatch('playback/repeat'); };

    return {
      repeatButton,
      disabled,
      onClicked,
    };
  },
});
</script>
