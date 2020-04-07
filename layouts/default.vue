<template>
  <v-app dark>
    <v-app-bar
      v-if="isLoggedin"
      app
      :height="40" />
    <v-navigation-drawer
      v-if="isLoggedin"
      app />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: mapGetters('auth', [
    'isLoggedin',
  ]),
});
</script>
