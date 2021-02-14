<template>
  <v-overlay
    :key="$overlay.fullscreen"
    v-model="overlay"
    :opacity="$overlay.opacity"
    :z-index="$overlay.zIndex"
    :class="$style.Overlay"
    :style="styles"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { useContentPosition } from '~/use/style';

export default defineComponent({
  setup(_, { root }) {
    const overlay = computed<boolean>({
      get() { return root.$overlay.value; },
      set(v) { root.$overlay.change(v); },
    });
    const styles = computed(() => {
      return root.$overlay.fullscreen
        ? {
          position: 'fixed' as const,
          top: 0,
          botom: 0,
          left: 0,
          right: 0,
        }
        : useContentPosition(root).value;
    });

    return {
      overlay,
      styles,
    };
  },
});
</script>

<style lang="scss" module>
.Overlay {
  z-index: z-index-of(overlay);
}
</style>
