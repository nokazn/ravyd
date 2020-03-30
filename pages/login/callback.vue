<template>
  <div :class="$style.progress_circular">
    <v-progress-circular
      indeterminate
      :size="50"
      :width="5" />
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue';
import { Spotify } from '@/types';

export default Vue.extend({
  async fetch({
    query, $axios, store, redirect,
  }): Promise<void> {
    const { code } = query;
    const { data: { access_token } }: { data: Spotify.Auth.TokenResponseData } = await $axios({
      method: 'POST',
      url: `${process.env.BASE_URL}/api/auth/callback`,
      params: {
        code,
      },
    });
    store.commit('auth/setToken', access_token);

    redirect('/');
  },
});
</script>

<style lang="scss" module>
.progress_circular {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
