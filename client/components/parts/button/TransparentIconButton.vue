<template>
  <button>
    <v-icon
      :size="size"
      :color="color"
      class="transparent-icon-button"
    >
      {{ icon }}
    </v-icon>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
    color: {
      type: String,
      default: undefined,
    },
  },
});
</script>

<style lang="scss" scoped>
.transparent-icon-button {
  background: none;
}
</style>
