<template>
  <v-bottom-navigation
    app
    padless
    :height="DEVICE_BAR_HEIGHT"
    background-color="primary"
    :class="$style.DeviceBar"
  >
    <v-icon
      left
      small
    >
      mdi-volume-high
    </v-icon>
    <div>
      {{ name }} で再生中
    </div>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import { DEVICE_BAR_HEIGHT } from '~/constants';

type Data = {
  DEVICE_BAR_HEIGHT: number;
}

export default Vue.extend({
  data(): Data {
    return {
      DEVICE_BAR_HEIGHT,
    };
  },

  computed: {
    name(): string {
      return this.$getters()['playback/activeDevice']?.name ?? '他のデバイス';
    },
  },
});
</script>

<style lang="scss" module>
.DeviceBar {
  padding: 0 max(1vw, 16px);
  font-size: 12px;
  line-height: 24px;
  display: flex;
  // center なのを上書き
  justify-content: flex-end !important;
  align-content: center;
}
</style>
