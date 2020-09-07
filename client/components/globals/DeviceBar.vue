<template>
  <div
    class="primary"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    name(): string {
      return this.$getters()['playback/activeDevice']?.name ?? '他のデバイス';
    },
  },
});
</script>

<style lang="scss" module>
.DeviceBar {
  height: $g-device-bar-height;
  width: 100vw;
  padding: 0 12px;
  font-size: 12px;
  line-height: 24px;
  display: flex;
  justify-content: flex-end;
  align-content: center;
}
</style>
