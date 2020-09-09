<template>
  <div
    :title="sliderTitle"
    :class="$style.VolumeSlider"
  >
    <v-btn
      icon
      :width="32"
      :height="32"
      :title="buttonTitle"
      @click="onVolumeButtonClicked"
    >
      <v-icon
        :size="20"
        :color="buttonColor"
      >
        {{ icon }}
      </v-icon>
    </v-btn>

    <v-slider
      color="active-icon"
      thumb-color="white"
      hide-details
      dense
      :value="volumePercent"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'typed-vuex';
import { ZeroToHundred } from '~~/types';

type VolumeButtonIcon = 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'

export default Vue.extend({
  computed: {
    // volumePercent と isMuted は localStorage で永続化されてる
    volumePercent(): RootState['playback']['volumePercent'] {
      return this.isMuted
        ? 0
        : this.$state().playback.volumePercent;
    },
    isMuted(): RootState['playback']['isMuted'] {
      return this.$state().playback.isMuted;
    },
    icon(): VolumeButtonIcon {
      const { isMuted, volumePercent } = this;
      if (isMuted || volumePercent === 0) return 'mdi-volume-mute';
      if (volumePercent === 100) return 'mdi-volume-high';

      const volumeIconList: VolumeButtonIcon[] = [
        'mdi-volume-low',
        'mdi-volume-medium',
        'mdi-volume-high',
      ];
      const index = Math.floor((volumePercent / 100) * volumeIconList.length);

      return volumeIconList[index];
    },
    buttonColor(): string | undefined {
      return this.isMuted
        ? 'inactive'
        : undefined;
    },
    buttonTitle(): string {
      return this.isMuted
        ? 'ミュートを解除'
        : 'ミュート';
    },
    sliderTitle(): string {
      return this.isMuted
        ? 'ミュート中'
        : `ボリューム ${this.volumePercent}%`;
    },
  },

  methods: {
    onChange(volumePercent: ZeroToHundred) {
      this.$dispatch('playback/volume', { volumePercent });
    },
    onVolumeButtonClicked() {
      this.$dispatch('playback/mute');
    },
  },
});
</script>

<style lang="scss" module>
.VolumeSlider {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 140px;
}
</style>
