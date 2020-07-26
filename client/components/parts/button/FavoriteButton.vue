<template>
  <v-btn
    icon
    :width="size"
    :height="size"
    :outlined="outlined"
    :disabled="disabled"
    :title="title"
    @click="onClicked"
  >
    <v-icon :size="iconSize">
      {{ favoriteIcon }}
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export type FavoriteIcon = 'mdi-heart' | 'mdi-heart-outline';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: boolean
}

export default Vue.extend({
  props: {
    isFavorited: {
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
      return this.isFavorited
        ? 'mdi-heart'
        : 'mdi-heart-outline';
    },
    title(): string {
      return this.isFavorited
        ? `${this.text}しない`
        : `${this.text}する`;
    },
    iconSize(): number {
      return (this.size * 0.8) / Math.SQRT2;
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_CLICKED, !this.isFavorited);
    },
  },
});
</script>
