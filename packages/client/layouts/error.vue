<template>
  <main :class="$style.ErrorPage">
    <h1>
      {{ errorMessage }}
    </h1>
    <NuxtLink to="/">
      トップへ戻る
    </NuxtLink>
  </main>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import type { NuxtError } from '@nuxt/types';

type Data = {
  errorMessage: string;
};

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

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');

    const { error } = this;
    if (error.statusCode !== 404) {
      console.error(error);
    }
  },
});
</script>

<style lang="scss" module>
.ErrorPage {
  padding: 16px 4%;
}
</style>
