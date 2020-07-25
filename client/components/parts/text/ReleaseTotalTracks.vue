<template>
  <span
    :title="title"
    class="subtext--text"
  >
    <v-icon
      :size="size"
      color="subtext"
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
  text: string
  title: string
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
      default: 16,
    },
  },

  data() {
    const text = `${this.total}${this.unit}`;
    const title = `全${text}`;
    const textStyles = {
      fontSize: `${this.size * 0.8}px`,
    };

    return {
      text,
      title,
      textStyles,
    };
  },
});
</script>
