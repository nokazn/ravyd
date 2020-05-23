<template>
  <v-app
    dark
    :class="$style.ErrorPage">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      トップへ戻る
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    };
  },
  head() {
    const title = this.error.statusCode === 404
      ? this.pageNotFound
      : this.otherError;

    return { title };
  },
};
</script>

<style lang="scss" module>
.ErrorPage {
  padding: 16px 4%;
}
</style>
