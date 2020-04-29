<template>
  <div :class="$style.SeekBar">
    <v-slider
      v-model="position"
      dense
      hide-details
      color="lime"
      thumb-color="white"
      :max="duration"
      :class="$style.SeekBar__slider"
      @end="onEnd"
      @mouseup="onMouseup" />

    <div :class="$style.SeekBar__mss">
      <span v-if="position != null">
        {{ positionMss }}
      </span>

      <span v-if="duration">
        {{ durationMss }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

export type Data = {
  updateInterval: ReturnType<typeof setInterval> | null
}

export default Vue.extend({
  data(): Data {
    return {
      updateInterval: null,
    };
  },

  computed: {
    position: {
      get(): RootState['player']['position'] {
        return this.$state().player.position;
      },
      set(value: number) {
        this.$commit('player/SET_POSITION', value);
      },
    },
    positionMss(): string {
      return this.$dayjs(this.position).format('m:ss');
    },
    duration(): RootState['player']['duration'] {
      return this.$state().player.duration;
    },
    durationMss(): string {
      return this.$dayjs(this.duration).format('m:ss');
    },
    isPlaying(): RootState['player']['isPlaying'] {
      return this.$state().player.isPlaying;
    },
  },

  watch: {
    // curr の引数の型指定をすると $state 等の型推論が効かなくなる
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
    onEnd(value: number) {
      this.$emit('on-change', value);
    },
    onMouseup() {
      // setter の後に実行させたい
      setTimeout(() => {
        this.$emit('on-change', this.position);
      }, 0);
    },
    updatePosition() {
      const intervalMs = 300;
      if (this.updateInterval != null) clearInterval(this.updateInterval);
      this.updateInterval = setInterval(() => {
        // position が duration より大きい値になった場合は次の曲に移る
        this.$commit('player/SET_POSITION', this.$state().player.position + intervalMs);
      }, intervalMs);
    },
    clearInterval() {
      if (this.updateInterval != null) clearInterval(this.updateInterval);
      this.updateInterval = null;
    },
  },
});
</script>

<style lang="scss" module>
.SeekBar {
  width: 100%;
  &__mss {
    font-size: 10px;
    margin-top: -4px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
