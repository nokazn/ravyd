<template>
  <page>
    <v-app
      dark
      :class="$style.ErrorPage"
    >
      <h1>
        {{ errorMessage }}
      </h1>
      <NuxtLink to="/">
        トップへ戻る
      </NuxtLink>
    </v-app>
  </page>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { NuxtError } from '@nuxt/types';

import Page from '~/components/globals/Page.vue';

type Data = {
  errorMessage: string
}

export default Vue.extend({
  layout: 'empty',
  components: {
    Page,
  },

  props: {
    error: {
      type: Object as PropType<NuxtError>,
      default: null,
    },
  },

  data(): Data {
    const errorMessage = this.error.statusCode === 404
      ? '404 Not Found'
      : 'An error occurred';

    return {
      errorMessage,
    };
  },

  head(): { title: string } {
    return { title: this.errorMessage };
  },
});
</script>

<style lang="scss" module>
.ErrorPage {
  padding: 8px 4%;
}
</style>
