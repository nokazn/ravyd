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
      // 初めにクリックされてから1秒以内に再度クリックされたら前の曲に戻る
      if (this.firstClicked) {
        this.$dispatch('playback/previous');
      } else {
        this.firstClicked = true;
        const interval = 1000;
        setTimeout(() => {
          this.firstClicked = false;
        }, interval);

        this.$dispatch('playback/seek', { positionMs: 0 });
      }
    },
  },
});
</script>
