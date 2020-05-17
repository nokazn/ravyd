<template>
  <span :class="$style.ReleaseLabel">
    <v-icon
      :size="size"
      color="grey lighten-1">
      mdi-album
    </v-icon>
    <span :style="textStyles">
      {{ label }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

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

  computed: {
    textStyles(): { 'font-size': string } {
      return {
        'font-size': `${this.size * 0.8}px`,
      };
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseLabel {
  color: $g-subtitle-color;
}
</style>
