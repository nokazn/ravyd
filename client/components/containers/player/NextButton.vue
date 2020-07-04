<template>
  <v-btn
    icon
    large
    title="次の曲"
    @click="onClicked"
  >
    <v-icon :size="size">
      mdi-skip-next
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 28,
    },
  },
  methods: {
    onClicked() {
      this.$dispatch('player/next');
    },
  },
});
</script>
