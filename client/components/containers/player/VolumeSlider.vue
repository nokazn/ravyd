<template>
  <div :class="$style.VolumeSlider">
    <v-btn
      icon
      small
      :title="volumeButton.title">
      <v-icon small>
        {{ volumeButton.icon }}
      </v-icon>
    </v-btn>

    <v-slider
      v-model="volume"
      color="cyan"
      thumb-color="white"
      hide-details
      dense
      @end="onEnd"
      @mouseup="onMouseup" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

export type VolumeButton = {
  icon: 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'
  title: 'ミュート' | 'ミュートを解除'
}

export default Vue.extend({
  computed: {
    volume: {
      get(): RootState['player']['volume'] {
        return this.$state().player.volume;
      },
      set(volumePercent: number) {
        this.$commit('player/SET_VOLUME', { volumePercent });
      },
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
      this.$emit('on-change', value);
    },
    onMouseup() {
      setTimeout(() => {
        this.$emit('on-change', this.volume);
      }, 0);
    },
  },
});
</script>

<style lang="scss" module>
.VolumeSlider {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 120px;
}
</style>
