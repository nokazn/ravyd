<template>
  <div :class="$style.VolumeSlider">
    <v-icon small>
      {{ volumeIcon }}
    </v-icon>

    <v-slider
      v-model="volume"
      color="cyan"
      thumb-color="white"
      hide-details
      dense
      @end="onEnd"
      @mouseup="onMouseup" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

export type Data = {
  volumeIconList: [
    'mdi-volume-mute',
    'mdi-volume-low',
    'mdi-volume-medium',
    'mdi-volume-high',
    'mdi-volume-high',
  ],
}

const instance = Vue.extend({
  data(): Data {
    return {
      volumeIconList: [
        'mdi-volume-mute',
        'mdi-volume-low',
        'mdi-volume-medium',
        'mdi-volume-high',
        'mdi-volume-high',
      ],
    };
  },

  computed: {
    volume: {
      get(): RootState['player']['volume'] {
        return this.$state().player.volume;
      },
      set(value: number) {
        this.$commit('player/SET_VOLUME', value);
      },
    },
    volumeIcon(): Data['volumeIconList'][keyof Data['volumeIconList']] {
      const index = Math.min(
        Math.floor((this.volume / 100) * this.volumeIconList.length),
        this.volumeIconList.length - 1,
      );
      return this.volumeIconList[index];
    },
  },

  methods: {
    onEnd(value: number) {
      this.$emit('on-change', value);
    },
    onMouseup() {
      setTimeout(() => {
        this.$emit('on-change', this.volume);
      }, 0);
    },
  },
});

export default instance;
</script>

<style lang="scss" module>
.VolumeSlider {
  display: flex;
  justify-content: center;
  min-width: 120px;
  & > *:not(:last-child) {
    margin-right: 4px;
  }
}
</style>
