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
import debounce from 'lodash/debounce';
import { RootState, ExtendedMutationPayload } from 'vuex';

type Data = {
  volumePercent: number
  debounceSetter: (positionMs: number) => number
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
    const interval = 100;
    const debounceSetter = debounce((positionMs: number) => positionMs, interval);

    return {
      volumePercent: 0,
      debounceSetter,
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
    const subscribeVolume = ({ payload: { volumePercent } }: ExtendedMutationPayload<'player/SET_VOLUME'>) => {
      this.volumePercent = volumePercent;
    };
    const subscribeMuteState = ({ payload: isMuted }: ExtendedMutationPayload<'player/SET_IS_MUTED'>) => {
      if (!isMuted) {
        this.volumePercent = this.$state().player.volume;
      }
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'player/SET_VOLUME':
          subscribeVolume(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'player/SET_IS_MUTED':
          subscribeMuteState(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  },

  methods: {
    onChange(volumePercent: number) {
      this.$dispatch('player/volume', { volumePercent })
        .catch((err: Error) => {
          console.error({ err });
          this.$toast.show('warning', err.message);
        });
      this.volumeButton = volumeButton(volumePercent);
    },
    onVolumeButtonClicked() {
      this.$dispatch('player/mute')
        .catch((err: Error) => {
          console.error({ err });
          this.$toast.show('warning', err.message);
        });
      this.volumePercent = 0;
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
