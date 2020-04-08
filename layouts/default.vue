<template>
  <v-app dark>
    <v-app-bar
      v-if="isLoggedin"
      app
      :height="48">
      <div class="header">
        <search-field
          v-model="searchWords"
          class="header__search-field" />

        <user-menu />
      </div>
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
import UserMenu from '@/components/parts/menu/UserMenu.vue';

type Data = {
  searchWords: string
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
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
  justify-content: space-between;
  width: 100%;
  &__search-field {
    width: 20%;
  }
}
</style>
