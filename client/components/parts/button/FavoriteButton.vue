<template>
  <v-btn
    :width="size"
    :height="size"
    :color="fab ? color : undefined"
    :fab="fab"
    :icon="!fab"
    :outlined="outlined"
    :disabled="disabled"
    :title="title"
    @click.stop="onClicked"
  >
    <v-icon :size="iconSize">
      {{ favoriteIcon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type FavoriteIcon = 'mdi-heart' | 'mdi-heart-outline';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
}

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
    text: {
      type: String,
      default: '保存',
    },
    // fab の時のみ有効
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

  computed: {
    favoriteIcon(): FavoriteIcon {
      return this.value
        ? 'mdi-heart'
        : 'mdi-heart-outline';
    },
    title(): string {
      return this.value
        ? `${this.text}しない`
        : `${this.text}する`;
    },
    iconSize(): number {
      return (this.size * 0.8) / Math.SQRT2;
    },
  },

  methods: {
    onClicked() {
      this.$emit(INPUT, !this.value);
    },
  },
});
</script>
