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
import { RootState } from 'vuex';

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
    position(): RootState['player']['positionMs'] {
      return this.$state().player.positionMs;
    },
    disabledPlayingFromBegining(): RootState['player']['disabledPlayingFromBegining'] {
      return this.$state().player.disabledPlayingFromBegining;
    },
    disabledSkippingPrev(): boolean {
      return this.$getters()['player/isDisallowed']('skipping_prev');
    },
  },

  methods: {
    onPreivousClicked() {
      // 初めにクリックされてから1秒以内に再度クリックされたら前の曲に戻る
      if (this.firstClicked) {
        this.$dispatch('player/previous');
      } else {
        this.firstClicked = true;
        const interval = 1000;
        setTimeout(() => {
          this.firstClicked = false;
        }, interval);

        this.$dispatch('player/seek', { positionMs: 0 });
      }
    },
  },
});
</script>
