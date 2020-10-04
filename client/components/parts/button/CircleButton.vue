<template>
  <v-btn
    :width="size"
    :height="size"
    :color="fab ? color : undefined"
    :fab="fab"
    :icon="!fab"
    :outlined="outlined"
    :disabled="disabled"
    @click="onClicked"
  >
    <v-icon :size="iconSize || ((size * 0.8) / Math.SQRT2)">
      <slot />
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void;
}

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 36,
    },
    iconSize: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    color: {
      type: String,
      default: 'grey darken-3',
    },
    fab: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_CLICKED);
    },
  },
});
</script>
