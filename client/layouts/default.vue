<template>
  <v-app dark>
    <Header v-if="isLoggedin" />
    <NavigationDrawer v-if="isLoggedin" />

    <main
      :class="$style.ContentContainer"
      :style="styles"
    >
      <nuxt />
    </main>

    <Footer v-if="isLoggedin" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import Header from '@/components/globals/Header.vue';
import NavigationDrawer from '@/components/globals/NavigationDrawer.vue';
import Footer from '@/components/globals/Footer.vue';

export default Vue.extend({
  components: {
    Header,
    NavigationDrawer,
    Footer,
  },

  computed: {
    isLoggedin(): RootGetters['auth/isLoggedin'] {
      return this.$getters()['auth/isLoggedin'];
    },
    styles(): RootGetters['backgroundStyles'] {
      return this.$getters().backgroundStyles;
    },
  },

  // 初回アクセス時に onSpotifyWebPlaybackSDKReady が呼ばれるので、定義しておく必要がある
  mounted() {
    this.$dispatch('player/initPlayer');
  },
});
</script>

<style lang="scss" module>
.ContentContainer {
  padding: 0 0 $g-footer-height $g-navigation-drawer-width;
}
</style>
