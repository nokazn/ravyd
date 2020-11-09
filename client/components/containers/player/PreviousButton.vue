<template>
  <CircleButton
    title="前の曲"
    :size="size"
    :disabled="disabledPlayingFromBeginning && disabledSkippingPrev"
    @click="onPreivousClicked"
  >
    mdi-skip-previous
  </CircleButton>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'typed-vuex';
import CircleButton from '~/components/parts/button/CircleButton.vue';

type Data = {
  firstClicked: boolean
  previousTimer: ReturnType<typeof setTimeout> | undefined
}

export default Vue.extend({
  components: {
    CircleButton,
  },

  props: {
    size: {
      type: Number,
      default: 36,
    },
  },

  data(): Data {
    return {
      firstClicked: false,
      previousTimer: undefined,
    };
  },

  computed: {
    position(): RootState['playback']['positionMs'] {
      return this.$state().playback.positionMs;
    },
    disabledPlayingFromBeginning(): RootState['playback']['disabledPlayingFromBeginning'] {
      return this.$state().playback.disabledPlayingFromBeginning;
    },
    disabledSkippingPrev(): boolean {
      return this.$getters()['playback/isDisallowed']('skipping_prev');
    },
  },

  methods: {
    onPreivousClicked() {
      // 前の曲がない場合はすぐに先頭から再生
      if (this.disabledSkippingPrev) {
        this.$dispatch('playback/seek', { positionMs: 0 });
        return;
      }

      // 初めにクリックされてから1秒以内に再度クリックされたら前の曲に戻る
      if (this.firstClicked) {
        if (this.previousTimer != null) {
          clearTimeout(this.previousTimer);
          this.previousTimer = undefined;
        }
        this.$dispatch('playback/previous');
      } else {
        this.firstClicked = true;
        setTimeout(() => {
          this.firstClicked = false;
        }, 1000);

        // 二回目のクリックがないか 400ms は待ってキャンセルされなければ(とりあえず) 先頭から再生
        this.previousTimer = setTimeout(() => {
          this.$dispatch('playback/seek', { positionMs: 0 });
          this.previousTimer = undefined;
        }, 400);
      }
    },
  },
});
</script>
