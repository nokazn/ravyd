<template>
  <v-btn
    icon
    large
    :disabled="isPreviousDisallowed"
    title="前の曲"
    @click="onPreivousClicked"
    @dblclick="onPreviousDoubleClicked">
    <v-icon :size="size">
      mdi-skip-previous
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 28,
    },
  },

  computed: {
    position(): RootState['player']['position'] {
      return this.$state().player.position;
    },
    isPreviousDisallowed(): boolean {
      return this.$getters()['player/isPreviousDisallowed'] && this.position < 1000;
    },
  },

  methods: {
    onPreivousClicked() {
      // position が 0:01 未満のときに前の曲に戻る
      if (this.position < 1000) {
        this.$dispatch('player/previous');
      } else {
        this.$dispatch('player/seek', 0);
      }
    },
    onPreviousDoubleClicked() {
      this.$dispatch('player/previous');
    },
  },
});
</script>
