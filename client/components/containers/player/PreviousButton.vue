<template>
  <v-btn
    icon
    large
    :disabled="disabledPlayingFromBegining && disabledSkippingPrev"
    title="前の曲"
    @click="onPreivousClicked"
  >
    <v-icon :size="size">
      mdi-skip-previous
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'typed-vuex';

type Data = {
  firstClicked: boolean
  previousTimer: ReturnType<typeof setTimeout> | undefined
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 28,
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
    disabledPlayingFromBegining(): RootState['playback']['disabledPlayingFromBegining'] {
      return this.$state().playback.disabledPlayingFromBegining;
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
