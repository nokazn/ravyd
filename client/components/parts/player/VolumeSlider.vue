<template>
  <div :class="$style.VolumeSlider">
    <v-icon small>
      {{ volumeIcon }}
    </v-icon>

    <v-slider
      v-model="volume"
      hide-details
      dense />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
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
      set: debounce(function set(value: number) {
        // @todo
        // @ts-ignore
        this.$commit('player/SET_VOLUME', value);
      }, 300),
    },
    volumeIcon(): Data['volumeIconList'][keyof Data['volumeIconList']] {
      const index = Math.min(
        Math.floor((this.volume / 100) * this.volumeIconList.length),
        this.volumeIconList.length - 1,
      );
      return this.volumeIconList[index];
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
