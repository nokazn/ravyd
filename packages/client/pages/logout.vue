<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch({ app, redirect }) {
    await app.$dispatch('auth/logout')
      .then(() => {
        redirect('/login');
      })
      .catch((err) => {
        console.error(err);
        redirect('/');
      });
  },
});
</script>
