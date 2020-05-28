<template>
  <span
    :title="title"
    :class="$style.ReleaseTotalTracks"
  >
    <v-icon
      :size="size"
      color="grey lighten-1"
    >
      mdi-music-box-multiple-outline
    </v-icon>
    <span :style="textStyles">
      {{ totalTracks }}曲
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
    totalTracks: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },

  data() {
    const text = `${this.totalTracks}曲`;
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

<style lang="scss" module>
.ReleaseTotalTracks {
  color: $g-subtitle-color;
}
</style>
