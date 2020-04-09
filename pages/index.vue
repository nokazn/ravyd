<template>
  <main class="root-page" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch({ app }) {
    await app.$dispatch('browse/getNewReleases');
  },
});
</script>
