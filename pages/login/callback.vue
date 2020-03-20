<template>
  <v-progress-circular />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  async fetch({
    query, $axios, store, redirect,
  }): Promise<void> {
    const { code } = query;
    const { data } = await $axios({
      method: 'post',
      url: '/api/auth/callback',
      params: {
        code,
      },
    });
    store.commit('auth/setToken', data);
    redirect('/');
  },
});
</script>
