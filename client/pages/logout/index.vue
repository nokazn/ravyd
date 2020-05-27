<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  fetch({ app, redirect }) {
    app.$dispatch('auth/logout');
    redirect('/login');
  },
});
</script>
