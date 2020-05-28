<template>
  <page>
    <div :class="$style.progress_circular">
      <v-progress-circular
        indeterminate
        :size="50"
        :width="5"
      />
    </div>
  </page>
</template>

<script lang="ts">
import Vue from 'vue';

import Page from '~/components/globals/Page.vue';

export default Vue.extend({
  components: {
    Page,
  },

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
