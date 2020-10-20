<template>
  <v-overlay
    :opacity="1"
    :color="$constant.BACKGROUND_COLOR"
    :z-index="$constant.Z_INDEX_OF.loading"
    :class="$style.WaveLoader"
  >
    <div
      :class="$style.WaveLoader__wave"
      class="sk-wave"
    >
      <div class="sk-wave-rect" />
      <div class="sk-wave-rect" />
      <div class="sk-wave-rect" />
      <div class="sk-wave-rect" />
      <div class="sk-wave-rect" />
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
</script>

<style lang="scss" module>
.WaveLoader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: z-index-of(loading);
  display: flex;
  justify-content: center;
  align-items: center;

  &__wave {
    width: 48px;
    height: 56px;

    & > * {
      --sk-color: white;

      border-radius: 2px;

      &:not(:last-child) {
        margin-right: 2px;
      }
    }
  }
}
</style>
