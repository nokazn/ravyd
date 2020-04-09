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
      app
      permanent
      :mobile-break-point="768"
      expand-on-hover>
      <v-list
        nav>
        <v-list-item
          v-for="item in navigationDrawerItemList"
          :key="item.title"
          link
          nuxt
          :to="item.to"
          dense>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content app>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import SearchField from '@/components/parts/form/SearchField.vue';
import UserMenu from '@/components/parts/menu/UserMenu.vue';

type Data = {
  searchWords: string
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[]
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
  },

  data(): Data {
    return {
      searchWords: '',
      navigationDrawerItemList: [
        {
          title: 'ホーム',
          to: '/',
          icon: 'mdi-home',
        },
        {
          title: 'ライブラリ',
          to: '/library',
          icon: 'mdi-bookshelf',
        },
      ],
    };
  },

  computed: {
    isLoggedin() {
      return this.$getters['auth/isLoggedin'];
    },
  },
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
