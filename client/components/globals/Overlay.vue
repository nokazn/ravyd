<template>
  <v-overlay
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
  props: {
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, { root }) {
    const overlay = computed<boolean>({
      get() { return root.$overlay.value; },
      set(value) { root.$overlay.change(value); },
    });
    const styles = useContentPosition(root);

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
