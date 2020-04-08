<template>
  <button>
    <v-icon
      :size="size"
      class="transparent-icon-button">
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
  },
});
</script>

<style lang="scss" scoped>
.transparent-icon-button {
  background: none;
}
</style>
