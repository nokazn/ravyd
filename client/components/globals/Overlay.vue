<template>
  <v-overlay
    v-model="overlay"
    absolute
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
