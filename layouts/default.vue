<template>
  <v-app dark>
    <v-app-bar
      v-if="isLoggedin"
      app
      :height="48"
      class="header">
      <search-field
        v-model="searchWords"
        class="header__search-field" />
    </v-app-bar>

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
import SearchField from '@/components/parts/form/SearchField.vue';

type Data = {
  searchWords: string
}

export default Vue.extend({
  components: {
    SearchField,
  },

  data(): Data {
    return {
      searchWords: '',
    };
  },

  computed: mapGetters('auth', [
    'isLoggedin',
  ]),
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: flex-end;
  &__search-field {
    width: 30%;
  }
}
</style>
