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
    <v-icon
      :size="adjustedIconSize"
      :color="iconColor"
    >
      <slot />
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
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
    iconSizeRatio: {
      type: Number as PropType<number | undefined>,
      default: undefined,

    },
    color: {
      type: String,
      default: 'grey darken-3',
    },
    iconColor: {
      type: String,
      default: undefined,
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

  computed: {
    adjustedIconSize(): number {
      const ratio = this.iconSizeRatio ?? this.outlined ? 0.8 : 1;
      return this.iconSize ?? Math.floor((this.size * ratio) / Math.SQRT2);
    },
  },

  methods: {
    onClicked() {
      this.$emit(CLICK);
    },
  },
});
</script>
