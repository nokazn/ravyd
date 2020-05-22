<template>
  <v-navigation-drawer
    app
    permanent
    :color="NAVIGATION_DRAWER_BACKGROUND_COLOR"
    :mobile-break-point="768"
    expand-on-hover
    :class="$style.NavigationDrawer">
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
import { NAVIGATION_DRAWER_BACKGROUND_COLOR } from '~/variables';

type Data = {
  NAVIGATION_DRAWER_BACKGROUND_COLOR: typeof NAVIGATION_DRAWER_BACKGROUND_COLOR
  navigationDrawerItemList: {
    title: string
    to: string
    icon: string
  }[],
}

export default Vue.extend({
  data(): Data {
    return {
      NAVIGATION_DRAWER_BACKGROUND_COLOR,
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

<style lang="scss" module>
.NavigationDrawer {
  z-index: z-index-of(navigation-drawer)
}
</style>
