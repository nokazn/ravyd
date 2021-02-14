<template>
  <CircleButton
    title="前の曲"
    :size="size"
    :disabled="disabled"
    @click="onPreivousClicked"
  >
    mdi-skip-previous
  </CircleButton>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import CircleButton from '~/components/parts/button/CircleButton.vue';

export default defineComponent({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
    },
  },

  setup(_, { root }) {
    const firstClicked = ref(false);

    const position = computed(() => root.$state().playback.positionMs);
    const disallowedSkippingPrev = computed(() => root.$getters()['playback/isDisallowed']('skipping_prev'));
    const disabled = computed(() => {
      return disallowedSkippingPrev.value && root.$state().playback.disabledPlayingFromBeginning;
    });

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onPreivousClicked = () => {
      // 前の曲がない場合はすぐに先頭から再生
      if (disallowedSkippingPrev.value) {
        root.$dispatch('playback/seek', { positionMs: 0 });
        return;
      }

      // 初めにクリックされてから1秒以内に再度クリックされたら前の曲に戻る
      if (firstClicked.value) {
        if (timer != null) {
          clearTimeout(timer);
          timer = undefined;
        }
        root.$dispatch('playback/previous');
      } else {
        firstClicked.value = true;
        setTimeout(() => {
          firstClicked.value = false;
        }, 1000);

        // 二回目のクリックがないか 400ms は待ってキャンセルされなければ(とりあえず) 先頭から再生
        timer = setTimeout(() => {
          root.$dispatch('playback/seek', { positionMs: 0 });
          timer = undefined;
        }, 400);
      }
    };

    return {
      firstClicked,
      position,
      disabled,
      onPreivousClicked,
    };
  },
});
</script>
