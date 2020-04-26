<template>
  <v-navigation-drawer
    app
    color="#080808"
    permanent
    :mobile-break-point="768"
    expand-on-hover>
    <v-list nav>
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
</template>

<script lang="ts">
import Vue from 'vue';

type Data = {
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[],
}

export default Vue.extend({
  data(): Data {
    return {
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
});
</script>
