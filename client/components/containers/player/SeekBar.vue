<template>
  <div :class="$style.SeekBar">
    <v-slider
      :value="value"
      dense
      hide-details
      thumb-color="white"
      :color="seekbarColor"
      :max="maxMs"
      :class="$style.SeekBar__slider"
      @mousedown="onMouseDown"
      @input="onInput"
      @change="onChange"
    />

    <div :class="$style.SeekBar__mss">
      <span :class="$style['SeekBar__mss--left']">
        {{ positionMinutes }}:{{ positionSeconds }}
      </span>

      <span :class="$style['SeekBar__mss--right']">
        {{ durationMss }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { RootState, ExtendedMutationPayload } from 'vuex';

import { mssTime } from '~~/utils/mssTime';

export type Data = {
  value: number
  debounceSetter: (positionMs: number) => number
  updateInterval: ReturnType<typeof setInterval> | undefined
  mutationUnsubscribe: (() => void) | undefined
}

export default Vue.extend({
  data(): Data {
    const value = 0;
    const interval = 10;
    const debounceSetter = debounce((positionMs: number) => positionMs, interval);

    return {
      value,
      debounceSetter,
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

    durationMs(): RootState['player']['durationMs'] {
      return this.$state().player.durationMs;
    },
    durationMss(): string {
      return mssTime(this.durationMs);
    },

    maxMs(): number {
      return this.durationMs || 1;
    },
    isPlaying(): RootState['player']['isPlaying'] {
      return this.$state().player.isPlaying;
    },
    seekbarColor(): string {
      return this.isPlaying
        ? 'active-icon'
        : 'inactive';
    },
  },

  watch: {
    // @todo curr の引数の型指定をすると $state 等の型推論が効かなくなる
    isPlaying(curr): void {
      if (curr === true) {
        this.updatePosition();
      } else {
        this.clearInterval();
      }
    },
  },

  mounted() {
    if (this.isPlaying) {
      this.updatePosition();
    }

    const subscribePositionMs = (mutationPayload: ExtendedMutationPayload<'player/SET_POSITION_MS'>) => {
      this.value = mutationPayload.payload;
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'player/SET_POSITION_MS':
          subscribePositionMs(mutation as ExtendedMutationPayload<typeof type>);
          break;

        default:
          break;
      }
    });
  },

  beforeDestroy() {
    this.clearInterval();
  },

  methods: {
    onMouseDown() {
      this.clearInterval();
    },
    onInput(positionMs: number) {
      this.value = this.debounceSetter(positionMs);
    },
    onChange(positionMs: number) {
      this.$commit('player/SET_POSITION_MS', positionMs);
      this.$dispatch('player/seek', positionMs);
      this.updatePosition();
    },
    updatePosition() {
      const intervalMs = 500;
      if (this.updateInterval != null) {
        clearInterval(this.updateInterval);
      }

      this.updateInterval = setInterval(() => {
        this.value += intervalMs;
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
    font-size: 0.75rem;
    margin-top: -4px;
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
