<template>
  <span
    :title="title"
    :class="$style.ReleaseLabel"
  >
    <v-icon
      :size="size"
      color="subtext"
    >
      mdi-album
    </v-icon>
    <span :style="textStyles">
      {{ label }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export type Data = {
  title: string
  textStyles: { fontSize: string }
}

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
  },

  data(): Data {
    const title = `レーベル - ${this.label}`;
    const textStyles = { fontSize: `${this.size * 0.8}px` };
    return {
      title,
      textStyles,
    };
  },
});
</script>

<style lang="scss" module>
.ReleaseLabel {
  color: $g-subtitle-color;
}
</style>
