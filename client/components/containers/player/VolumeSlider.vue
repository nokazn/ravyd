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
        :color="volumeButtonColor"
      >
        {{ volumeButtonIcon }}
      </v-icon>
    </v-btn>

    <v-slider
      color="active-icon"
      thumb-color="white"
      hide-details
      dense
      :value="volumePercent"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';
import { ZeroToHundred } from '~~/types';

type Data = {
  volumePercent: number
  debounceSetter: (positionMs: number) => number
  volumeButtonIcon: VolumeButtonIcon
  mutationUnsubscribe: (() => void) | undefined
}

type VolumeButtonIcon = 'mdi-volume-mute' | 'mdi-volume-low' | 'mdi-volume-medium' | 'mdi-volume-high' | 'mdi-volume-high'

const volumeButtonIcon = (volumePercent: number, isMuted: boolean): VolumeButtonIcon => {
  if (isMuted || volumePercent === 0) return 'mdi-volume-mute';
  if (volumePercent === 100) return 'mdi-volume-high';

  const volumeIconList: Array<VolumeButtonIcon> = [
    'mdi-volume-low',
    'mdi-volume-medium',
    'mdi-volume-high',
  ];
  const index = Math.floor((volumePercent / 100) * volumeIconList.length);

  return volumeIconList[index];
};

export default Vue.extend({
  data(): Data {
    // volumePercent と isMuted は localStorage で永続化されてる
    const volumePercent = this.$state().playback.isMuted
      ? 0
      : this.$state().playback.volumePercent;
    const interval = 10;
    const debounceSetter = debounce((positionMs: number) => positionMs, interval);

    return {
      volumePercent,
      debounceSetter,
      mutationUnsubscribe: undefined,
      volumeButtonIcon: volumeButtonIcon(volumePercent, false),
    };
  },

  computed: {
    isMuted(): RootState['playback']['isMuted'] {
      return this.$state().playback.isMuted;
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
    volumeButtonColor(): string | undefined {
      return this.isMuted
        ? 'inactive'
        : undefined;
    },
  },

  mounted() {
    const subscribeVolume = ({ payload: { volumePercent } }: ExtendedMutationPayload<'playback/SET_VOLUME_PERCENT'>) => {
      this.volumePercent = volumePercent;
      this.volumeButtonIcon = volumeButtonIcon(volumePercent, this.isMuted);
    };
    const subscribeMuteState = ({ payload: isMuted }: ExtendedMutationPayload<'playback/SET_IS_MUTED'>) => {
      const { volumePercent } = this.$state().playback;
      this.volumePercent = isMuted ? 0 : volumePercent;
      this.volumeButtonIcon = volumeButtonIcon(volumePercent, this.isMuted);
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'playback/SET_VOLUME_PERCENT':
          subscribeVolume(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'playback/SET_IS_MUTED':
          subscribeMuteState(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  },

  beforeDestroy() {
    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  },

  methods: {
    onInput(volumePercent: ZeroToHundred) {
      this.volumePercent = this.debounceSetter(volumePercent);
    },
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
