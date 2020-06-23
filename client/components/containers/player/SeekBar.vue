<template>
  <div :class="$style.SeekBar">
    <v-slider
      v-model="positionMs"
      dense
      hide-details
      thumb-color="white"
      :color="seekbarColor"
      :max="maxMs"
      :class="$style.SeekBar__slider"
      @mousedown="onMouseDown"
      @change="onChange"
    />

    <div :class="$style.SeekBar__mss">
      <TrackTime
        :time-ms="positionMs"
        :class="$style['SeekBar__mss--left']"
      />

      <TrackTime
        :time-ms="durationMs"
        :class="$style['SeekBar__mss--right']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { RootState } from 'vuex';

import TrackTime from '~/components/parts/text/TrackTime.vue';

export type Data = {
  debounceSetter: (positionMs: number) => void
  updateInterval: ReturnType<typeof setInterval> | undefined
}

export default Vue.extend({
  components: {
    TrackTime,
  },

  data(): Data {
    const interval = 300;
    const debounceSetter = debounce((positionMs: number) => {
      this.$commit('player/SET_POSITION_MS', positionMs);
    }, interval);

    return {
      debounceSetter,
      updateInterval: undefined,
    };
  },

  computed: {
    positionMs: {
      get(): RootState['player']['positionMs'] {
        return this.$state().player.positionMs;
      },
      set(positionMs: number) {
        this.debounceSetter(positionMs);
      },
    },
    durationMs(): RootState['player']['durationMs'] {
      return this.$state().player.durationMs;
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
    if (this.isPlaying) this.updatePosition();
  },

  beforeDestroy() {
    this.clearInterval();
  },

  methods: {
    onMouseDown() {
      this.clearInterval();
    },
    onChange(positionMs: number) {
      // setter の後に実行させたい
      setTimeout(() => {
        this.$dispatch('player/seek', positionMs);
        this.updatePosition();
      }, 0);
    },
    updatePosition() {
      const intervalMs = 500;
      if (this.updateInterval != null) {
        clearInterval(this.updateInterval);
      }

      this.updateInterval = setInterval(() => {
        this.$commit('player/ADD_POSITION_MS', intervalMs);
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
