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
      v-model="volumePercent"
      color="active-icon"
      thumb-color="white"
      hide-details
      dense
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, ExtendedMutationPayload } from 'vuex';

type Data = {
  volumePercent: number
  volumeButton: VolumeButton
  mutationUnsubscribe: (() => void) | undefined
}

export type VolumeButton = {
  icon: 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'
  title: 'ミュート' | 'ミュートを解除'
}

const volumeButton = (volumePercent: number): VolumeButton => {
  const volumeIconList: Array<VolumeButton['icon']> = [
    'mdi-volume-mute',
    'mdi-volume-low',
    'mdi-volume-medium',
    'mdi-volume-high',
    'mdi-volume-high',
  ];
  const index = Math.min(
    Math.floor((volumePercent / 100) * volumeIconList.length),
    volumeIconList.length - 1,
  );
  const icon = volumeIconList[index];
  const title = volumePercent === 0
    ? 'ミュートを解除'
    : 'ミュート';

  return {
    icon,
    title,
  };
};

export default Vue.extend({
  data(): Data {
    return {
      volumePercent: 0,
      mutationUnsubscribe: undefined,
      volumeButton: volumeButton(100),
    };
  },

  computed: {
    isMuted(): RootState['player']['isMuted'] {
      return this.$state().player.isMuted;
    },
  },

  mounted() {
    const subscribeVolume = (mutationPayload: ExtendedMutationPayload<'player/SET_VOLUME'>) => {
      this.volumePercent = mutationPayload.payload.volumePercent;
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'player/SET_VOLUME':
          subscribeVolume(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  },

  methods: {
    onChange(volumePercent: number) {
      this.$commit('player/SET_VOLUME', { volumePercent });
      this.volumeButton = volumeButton(volumePercent);
    },
    onVolumeButtonClicked() {
      this.volumePercent = 0;
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
