<template>
  <v-app
    dark
    :class="$style.ErrorPage"
  >
    <main :class="$style.ErrorPage__container">
      <h1>
        {{ errorMessage }}
      </h1>
      <NuxtLink to="/">
        トップへ戻る
      </NuxtLink>
    </main>
  </v-app>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { NuxtError } from '@nuxt/types';

type Data = {
  errorMessage: string
}

export default Vue.extend({
  layout: 'empty',

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
  height: calc(100vh - #{$g-footer-height});
  &__container {
    padding: 60px 4%;
  }
}
</style>
