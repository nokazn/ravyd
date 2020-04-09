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

export default Vue.extend({
  async fetch({ query, app, redirect }): Promise<void> {
    const { code } = query;
    await app.$dispatch('auth/exchangeCodeToAccessToken', code as string);
    await app.$dispatch('auth/getUserData');

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
