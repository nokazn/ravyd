<template>
  <div :class="$style.SeekBar">
    <v-slider
      dense
      hide-details
      :class="$style.SeekBar__slider" />

    <div :class="$style.SeekBar__hmm">
      <span v-if="progress">
        {{ progress }}
      </span>

      <span v-if="duration">
        {{ duration }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    progress(): string | null {
      return this.$getters()['player/currentTrack']?.progress ?? null;
    },
    duration(): string | null {
      return this.$getters()['player/currentTrack']?.duration ?? null;
    },
  },
});
</script>

<style lang="scss" module>
.SeekBar {
  width: 100%;
  &__hmm {
    font-size: 10px;
    margin-top: -4px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
