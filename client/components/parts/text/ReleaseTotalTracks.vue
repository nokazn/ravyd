<template>
  <span
    :title="title"
    :class="{ ['subtext--text']: subtext }"
  >
    <v-icon
      :size="size * 1.25"
      :color="subtext ? 'subtext' : undefined"
    >
      mdi-music-box-multiple-outline
    </v-icon>
    <span :style="textStyles">
      {{ text }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export type Data = {
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    total: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '曲',
    },
    size: {
      type: Number,
      default: 12,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const textStyles = { fontSize: `${this.size}px` };
    return {
      textStyles,
    };
  },

  computed: {
    text(): string {
      return `${this.total}${this.unit}`;
    },
    title(): string {
      return `全${this.text}`;
    },
  },
});
</script>
