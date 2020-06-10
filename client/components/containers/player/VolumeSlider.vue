<template>
  <div :class="$style.VolumeSlider">
    <v-btn
      icon
      small
      :title="volumeButton.title"
      @click="onVolumeButtonClicked"
    >
      <v-icon small>
        {{ volumeButton.icon }}
      </v-icon>
    </v-btn>

    <v-slider
      v-model="volume"
      color="active-icon"
      thumb-color="white"
      hide-details
      dense
      @end="onEnd"
      @mouseup="onMouseup"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

export type VolumeButton = {
  icon: 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'
  title: 'ミュート' | 'ミュートを解除'
}

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: number
}

export default Vue.extend({
  computed: {
    volume: {
      get(): RootGetters['player/volume'] {
        return this.$getters()['player/volume'];
      },
      set(volumePercent: number) {
        this.$commit('player/SET_VOLUME', { volumePercent });
      },
    },
    isMuted(): boolean {
      return this.$state().player.isMuted;
    },
    volumeButton(): VolumeButton {
      const volumeIconList: Array<VolumeButton['icon']> = [
        'mdi-volume-mute',
        'mdi-volume-low',
        'mdi-volume-medium',
        'mdi-volume-high',
        'mdi-volume-high',
      ];
      const index = Math.min(
        Math.floor((this.volume / 100) * volumeIconList.length),
        volumeIconList.length - 1,
      );
      const icon = volumeIconList[index];
      const title = this.volume === 0
        ? 'ミュートを解除'
        : 'ミュート';

      return {
        icon,
        title,
      };
    },
  },

  methods: {
    onEnd(value: number) {
      this.$emit(ON_CHANGED, value);
    },
    onMouseup() {
      setTimeout(() => {
        this.$emit(ON_CHANGED, this.volume);
      }, 0);
    },
    onVolumeButtonClicked() {
      this.$dispatch('player/mute');
    },
  },
});
</script>

<style lang="scss" module>
.VolumeSlider {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 130px;
}
</style>
