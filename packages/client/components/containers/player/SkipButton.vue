<template>
  <CircleButton
    :size="size"
    :disabled="disabled"
    :title="skipButton.title"
    @click="onClicked"
  >
    {{ skipButton.icon }}
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type SkipButton = {
  title: string;
  icon: 'mdi-redo' | 'mdi-undo';
};

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    seconds: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 32,
    },
  },

  setup(props, { root }) {
    const skipButton = computed<SkipButton>(() => {
      const seconds = Math.abs(props.seconds);
      const skipText = props.seconds > 0
        ? '進む'
        : '戻す';
      const icon = props.seconds > 0
        ? 'mdi-redo'
        : 'mdi-undo';

      return {
        title: `${seconds}秒${skipText}`,
        icon,
      };
    });
    const disabled = computed(() => root.$getters()['playback/isDisallowed']('seeking'));

    const onClicked = () => {
      const ms = props.seconds * 1000;
      const positionMs = root.$getters()['playback/positionMs'] + ms;
      if (ms < 0) {
        // 戻る
        root.$dispatch('playback/seek', { positionMs: Math.max(positionMs, 0) });
      } else if (positionMs < root.$getters()['playback/durationMs']) {
        // 進む
        root.$dispatch('playback/seek', { positionMs });
      } else {
        // 次の曲
        root.$dispatch('playback/next');
      }
    };

    return {
      skipButton,
      disabled,
      onClicked,
    };
  },
});
</script>
