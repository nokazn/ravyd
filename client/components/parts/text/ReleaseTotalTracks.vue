<template>
  <span :class="$style.ReleaseTotalTracks">
    <v-icon
      :size="size"
      color="grey lighten-1">
      mdi-album
    </v-icon>
    <span :style="textStyles">
      {{ totalTracks }}曲
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

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

  computed: {
    textStyles(): { fontSize: string } {
      return {
        fontSize: `${this.size * 0.8}px`,
      };
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseTotalTracks {
  color: $g-subtitle-color;
}
</style>
