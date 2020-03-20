<template>
  <span>loading...</span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  middleware({ query, $axios, redirect }): void {
    const { code } = query;

    $axios({
      method: 'post',
      url: '/api/auth/callback',
      params: {
        code,
      },
    })
      .then(() => {
        redirect('/');
      })
      .catch((e) => console.error(e));
  },
});
</script>
