<template>
  <CircleButton
    :size="size"
    :icon-size="iconSize"
    :disabled="disabled"
    :title="mediaButton.title"
    @click="onClicked"
  >
    {{ mediaButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type MediaButton = {
  icon: 'mdi-play-circle' | 'mdi-pause-circle' | 'mdi-play' | 'mdi-pause';
  title: '再生' | '停止';
}

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
    },
    ratio: {
      type: Number,
      default: 0.75,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    const iconSize = props.circle
      ? props.size
      : Math.floor(props.size * props.ratio);

    // @todo resuming
    const disabled = computed(() => root.$getters()['playback/isDisallowed']('interrupting_playback'));
    const mediaButton = computed<MediaButton>(() => {
      if (root.$state().playback.isPlaying) {
        return {
          icon: props.circle ? 'mdi-pause-circle' : 'mdi-pause',
          title: '停止',
        };
      }
      return {
        icon: props.circle ? 'mdi-play-circle' : 'mdi-play',
        title: '再生',
      };
    });

    const onClicked = () => {
      if (root.$state().playback.isPlaying) {
        root.$dispatch('playback/pause');
      } else {
        root.$dispatch('playback/play');
      }
    };

    return {
      iconSize,
      disabled,
      mediaButton,
      onClicked,
    };
  },
});
</script>
