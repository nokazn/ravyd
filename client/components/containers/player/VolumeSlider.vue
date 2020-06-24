<template>
  <div :class="$style.VolumeSlider">
    <v-btn
      icon
      :width="32"
      :height="32"
      :title="volumeButtonTitle"
      @click="onVolumeButtonClicked"
    >
      <v-icon
        :size="20"
        :color="volumeButtonColor"
      >
        {{ volumeButtonIcon }}
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
  volumeButtonIcon: VolumeButtonIcon
  mutationUnsubscribe: (() => void) | undefined
}

type VolumeButtonIcon = 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'

const volumeButtonIcon = (volumePercent: number, isMuted: boolean): VolumeButtonIcon => {
  if (isMuted) return 'mdi-volume-mute';

  const volumeIconList: Array<VolumeButtonIcon> = [
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

  return volumeIconList[index];
};

export default Vue.extend({
  data(): Data {
    const volumePercent = 100;
    const interval = 100;
    const debounceSetter = debounce((positionMs: number) => positionMs, interval);

    return {
      volumePercent,
      debounceSetter,
      mutationUnsubscribe: undefined,
      volumeButtonIcon: volumeButtonIcon(volumePercent, false),
    };
  },

  computed: {
    isMuted(): RootState['player']['isMuted'] {
      return this.$state().player.isMuted;
    },
    volumeButtonTitle(): string {
      return this.isMuted
        ? 'ミュートを解除'
        : 'ミュート';
    },
    volumeButtonColor(): string | undefined {
      return this.isMuted
        ? 'inactive'
        : undefined;
    },
  },

  mounted() {
    const subscribeVolume = ({ payload: { volumePercent } }: ExtendedMutationPayload<'player/SET_VOLUME'>) => {
      this.volumePercent = volumePercent;
      this.volumeButtonIcon = volumeButtonIcon(volumePercent, this.isMuted);
    };
    const subscribeMuteState = ({ payload: isMuted }: ExtendedMutationPayload<'player/SET_IS_MUTED'>) => {
      const volumePercent = this.$state().player.volume;
      this.volumePercent = isMuted ? 0 : volumePercent;
      this.volumeButtonIcon = volumeButtonIcon(volumePercent, this.isMuted);
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
    },
    onVolumeButtonClicked() {
      this.$dispatch('player/mute')
        .catch((err: Error) => {
          console.error({ err });
          this.$toast.show('warning', err.message);
        });
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
