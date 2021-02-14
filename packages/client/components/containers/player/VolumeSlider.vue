<template>
  <div
    :title="title"
    :class="$style.VolumeSlider"
  >
    <v-btn
      icon
      :width="32"
      :height="32"
      :color="button.color"
      :title="button.title"
      @click="toggleMute"
    >
      <v-icon :size="20">
        {{ icon }}
      </v-icon>
    </v-btn>

    <v-slider
      dense
      hide-details
      color="active-icon"
      thumb-color="white"
      :value="volumePercent"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import type { ZeroToHundred } from 'shared/types';

type VolumeButtonIcon = 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'
type VolumeButton = {
  color: undefined | 'inactive';
  title: 'ミュートを解除' | 'ミュート';
}

export default defineComponent({
  setup(_, { root }) {
    const isMuted = computed(() => root.$state().playback.isMuted);
    // volumePercent と isMuted は localStorage で永続化されてる
    const volumePercent = computed(() => {
      return isMuted.value
        ? 0
        : root.$state().playback.volumePercent;
    });

    const icon = computed<VolumeButtonIcon>(() => {
      if (isMuted.value || volumePercent.value === 0) return 'mdi-volume-mute';
      if (volumePercent.value === 100) return 'mdi-volume-high';
      const volumeIconList: VolumeButtonIcon[] = [
        'mdi-volume-low',
        'mdi-volume-medium',
        'mdi-volume-high',
      ];
      const index = Math.floor((volumePercent.value / 100) * volumeIconList.length);
      return volumeIconList[index];
    });
    const button = computed<VolumeButton>(() => {
      return isMuted.value
        ? {
          color: 'inactive',
          title: 'ミュートを解除',
        }
        : {
          color: undefined,
          title: 'ミュート',
        };
    });
    const title = computed(() => {
      return isMuted.value
        ? 'ミュート中'
        : `ボリューム ${volumePercent.value}%`;
    });

    const onChange = (v: ZeroToHundred) => { root.$dispatch('playback/volume', { volumePercent: v }); };
    const toggleMute = () => { root.$dispatch('playback/mute'); };

    return {
      volumePercent,
      icon,
      button,
      title,
      onChange,
      toggleMute,
    };
  },
});
</script>

<style lang="scss" module>
.VolumeSlider {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 148px;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
}
</style>
