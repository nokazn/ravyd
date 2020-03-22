<template>
  <div :class="$style.progress_circular">
    <v-progress-circular
      indeterminate
      :size="50"
      :width="5" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import { Spotify } from '@/types';

export default Vue.extend({
  async fetch({ query, $axios, store }): Promise<void> {
    const { code } = query;
    // eslint-disable-next-line camelcase
    const { data: { access_token } }: { data: Spotify.Auth.TokenResponseData } = await $axios({
      method: 'POST',
      url: '/api/auth/callback',
      params: {
        code,
      },
    });
    store.commit('auth/setToken', access_token);
  },

  async mounted(): Promise<void> {
    await this.getUserData();
    // callback ページがレンダリングされて、vuex-persistence が有効になってからページ遷移する
    this.$router.replace('/');
  },

  methods: mapActions('auth', [
    'getUserData',
  ]),
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
