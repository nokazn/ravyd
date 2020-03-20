<template>
  <v-progress-circular />
</template>

<script lang="ts">
import Vue from 'vue';
import { Spotify } from '@/types';

export default Vue.extend({
  async fetch({
    query, $axios, store, redirect,
  }): Promise<void> {
    const { code } = query;
    const { data }: { data: Spotify.Auth.TokenResponseData | null } = await $axios({
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
