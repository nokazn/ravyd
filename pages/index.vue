<template>
  <main class="root-page" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch({ $dispatch }) {
    await $dispatch('browse/getNewReleases');
  },
});
</script>
