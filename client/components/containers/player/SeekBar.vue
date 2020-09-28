<template>
  <div :class="$style.SeekBar">
    <v-slider
      dense
      hide-details
      :color="seekbarColor"
      :thumb-color="thumbColor"
      :disabled="disabled"
      :max="durationMs"
      :value="value"
      :class="$style.SeekBar__slider"
      :style="cssProps"
      @mousedown="onMouseDown"
      @change="onChange"
    />

    <div
      v-if="!hideText"
      :class="$style.SeekBar__mss"
    >
      <span :class="$style['SeekBar__mss--left']">
        {{ positionMinutes }}:{{ positionSeconds }}
      </span>
      <span
        :title="durationMsTitle"
        :class="$style['SeekBar__mss--right']"
      >
        {{ durationMss }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import { elapsedTime } from '~~/utils/elapsedTime';

type Data = {
  value: number
  updateInterval: ReturnType<typeof setInterval> | undefined
  mutationUnsubscribe: (() => void) | undefined
}

export default Vue.extend({
  props: {
    hideText: {
      type: Boolean,
      default: false,
    },
    thumbColor: {
      type: String,
      default: 'white',
    },
  },

  data(): Data {
    const value = this.$state().playback.positionMs;

    return {
      value,
      updateInterval: undefined,
      mutationUnsubscribe: undefined,
    };
  },

  computed: {
    // @todo this.value が undefined になるときがある
    positionMinutes(): string {
      return Math.floor((this.value ?? 0) / 1000 / 60).toString();
    },
    // @todo this.value が undefined になるときがある
    positionSeconds(): string {
      return Math.floor(((this.value ?? 0) / 1000) % 60).toString().padStart(2, '0');
    },

    durationMs(): RootState['playback']['durationMs'] {
      return this.$state().playback.durationMs;
    },
    durationMss(): string {
      return elapsedTime(this.durationMs);
    },
    durationMsTitle(): string | undefined {
      return this.durationMs === this.$constant.DEFAULT_DURATION_MS
        ? '再生時間が取得できません'
        : undefined;
    },

    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
    },
    disabled(): boolean {
      // durationMs が不適な値の場合もシークバーを操作できないようにするs
      return this.$getters()['playback/isDisallowed']('seeking')
        || this.durationMs === this.$constant.DEFAULT_DURATION_MS;
    },
    disabledPlayingFromBegining(): RootState['playback']['disabledPlayingFromBegining'] {
      return this.$state().playback.disabledPlayingFromBegining;
    },
    seekbarColor(): string {
      return this.isPlaying
        ? 'active-icon'
        : 'grey lighten-2';
    },
    cssProps(): Record<string, string> {
      return {
        '--margin-side': this.thumbColor === 'transparent'
          ? '0'
          : '8px',
      };
    },
  },

  mounted() {
    if (this.isPlaying) {
      this.updatePosition();
    }

    const subscribeIsPlaying = ({ payload: isPlaying }: ExtendedMutationPayload<'playback/SET_IS_PLAYING'>) => {
      if (isPlaying) {
        this.updatePosition();
      } else {
        this.clearInterval();
      }
    };

    const subscribePositionMs = ({ payload }: ExtendedMutationPayload<'playback/SET_POSITION_MS'>) => {
      this.value = payload;
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'playback/SET_IS_PLAYING':
          subscribeIsPlaying(mutation as ExtendedMutationPayload<typeof type>);
          break;
        case 'playback/SET_POSITION_MS':
          subscribePositionMs(mutation as ExtendedMutationPayload<typeof type>);
          break;
        default:
          break;
      }
    });
  },

  beforeDestroy() {
    this.clearInterval();
    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  },

  methods: {
    onMouseDown() {
      this.clearInterval();
    },
    async onChange(positionMs: number) {
      const currentPositionMs = this.$state().playback.positionMs;
      this.$commit('playback/SET_POSITION_MS', positionMs);
      await this.$dispatch('playback/seek', { positionMs, currentPositionMs });

      if (this.isPlaying) {
        this.updatePosition();
      }
    },
    updatePosition() {
      const intervalMs = 500;
      if (this.updateInterval != null) {
        clearInterval(this.updateInterval);
      }

      this.updateInterval = setInterval(() => {
        this.value += intervalMs;

        // 1000ms 以内かどうかの情報がストアと異なる場合は更新
        const disabledPlayingFromBegining = this.value <= 1000;
        if (disabledPlayingFromBegining !== this.disabledPlayingFromBegining) {
          this.$commit('playback/SET_DISABLED_PLAYING_FROM_BEGINING', disabledPlayingFromBegining);
        }
      }, intervalMs);
    },
    clearInterval() {
      if (this.updateInterval != null) {
        clearInterval(this.updateInterval);
        this.updateInterval = undefined;
      }
    },
  },
});
</script>

<style lang="scss" module>
.SeekBar {
  width: 100%;

  &__mss {
    font-size: 0.75em;
    margin-top: -0.5em;
    position: relative;

    & > * {
      position: absolute;
    }

    &--right {
      right: 0;
    }
  }
}
</style>

<style lang="scss">
.v-slider {
  &--horizontal {
    margin-left: var(--margin-side) !important;
    margin-right: var(--margin-side) !important;
  }
}
</style>
