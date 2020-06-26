<template>
  <v-app dark>
    <Header v-if="isLoggedin" />
    <NavigationDrawer v-if="isLoggedin" />

    <main
      :class="$style.ContentContainer"
      :style="styles"
    >
      <div :class="$style.Spacer" />

      <transition name="fade">
        <nuxt v-if="onLoaded" />

        <div
          v-else
          :class="$style.ProgressCircular"
        >
          <v-progress-circular
            indeterminate
          />
        </div>
      </transition>
    </main>

    <Footer v-if="isLoggedin" />

    <Toast
      v-bind="$toast"
      @on-changed="onToastChanged"
    />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import Header from '@/components/globals/Header.vue';
import NavigationDrawer from '@/components/globals/NavigationDrawer.vue';
import Footer from '@/components/globals/Footer.vue';
import Toast, { On as OnToast } from '@/components/globals/Toast.vue';

type Data = {
  onLoaded: boolean
}

export default Vue.extend({
  components: {
    Header,
    NavigationDrawer,
    Footer,
    Toast,
  },

  data(): Data {
    return {
      onLoaded: false,
    };
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
    this.onLoaded = true;
    console.log('on-loaded');
    this.$dispatch('player/initPlayer');
  },

  methods: {
    onToastChanged(isShown: OnToast['on-changed']) {
      this.$toast.change(isShown);
    },
  },
});
</script>

<style lang="scss" module>
.ContentContainer {
  padding: 0 0 $g-footer-height $g-navigation-drawer-width;
}

.Spacer {
  height: $g-header-height;
}

.ProgressCircular {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - #{$g-header-height} - #{$g-footer-height});
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
