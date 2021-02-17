<template>
  <v-bottom-navigation
    app
    padless
    background-color="primary"
    :height="$constant.DEVICE_BAR_HEIGHT"
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
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  setup(_, { root }) {
    const name = computed(() => root.$getters()['playback/activeDevice']?.name ?? '他のデバイス');
    return { name };
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
  align-items: center;
  z-index: z-index-of(footer) !important;
}
</style>
