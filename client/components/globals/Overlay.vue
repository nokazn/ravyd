<template>
  <v-overlay
    v-model="overlay"
    absolute
    :opacity="opacity"
    :z-index="zIndex"
    :class="$style.Overlay"
  />
</template>

<script lang="ts">
import Vue from 'vue';

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
    opacity: {
      type: Number,
      default: 0.5,
    },
    zIndex: {
      type: Number,
      default: 200,
    },
  },

  computed: {
    overlay: {
      get(): boolean {
        return this.isShown;
      },
      set(isShown: boolean) {
        this.$emit(ON_CHANGED, isShown);
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
