<template>
  <v-overlay
    v-model="overlay"
    :opacity="opacity"
    :z-index="zIndex"
    :class="$style.Overlay"
  />
</template>

<script lang="ts">
import Vue from 'vue';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean
}

export default Vue.extend({
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

  computed: {
    overlay: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit(INPUT, value);
      },
    },
  },
});
</script>

<style lang="scss" module>
.Overlay {
  z-index: z-index-of(overlay);
}
</style>
