<template>
  <v-overlay
    v-model="overlay"
    :opacity="opacity"
    :z-index="zIndex"
    :class="$style.Overlay"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    opacity: {
      type: Number,
      default: 0.6,
    },
    zIndex: {
      type: Number,
      default: 10,
    },
  },

  setup(props, { emit }) {
    const overlay = computed<boolean>({
      get() { return props.value; },
      set(value) { emit(INPUT, value); },
    });
    return { overlay };
  },
});
</script>

<style lang="scss" module>
.Overlay {
  z-index: z-index-of(overlay);
}
</style>
