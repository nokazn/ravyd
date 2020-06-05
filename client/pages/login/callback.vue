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

export default Vue.extend({
  async fetch({ query, app, redirect }): Promise<void> {
    const code = query.code as string;
    await app.$dispatch('auth/exchangeCodeToAccessToken', code);

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
