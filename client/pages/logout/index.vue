<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch({ app, redirect }) {
    await app.$dispatch('auth/logout');
    redirect('/login');
  },
});
</script>
