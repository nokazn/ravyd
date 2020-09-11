<template>
  <div :class="$style.CallbackPage">
    <v-progress-circular
      indeterminate
      :size="50"
      :width="5"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getQuery } from '~/utils/text/getQuery';

export default Vue.extend({
  async fetch({ query, app, redirect }): Promise<void> {
    const code = getQuery(query, 'code');
    const state = getQuery(query, 'state');
    if (code != null && state != null) {
      await app.$dispatch('auth/exchangeCodeToAccessToken', {
        code,
        state,
      });
    }

    redirect('/');
  },
});
</script>

<style lang="scss" module>
.CallbackPage {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
