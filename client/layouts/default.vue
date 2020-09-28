<template>
  <v-app
    dark
    :class="$style.Default"
  >
    <v-overlay
      v-if="!isLoaded"
      :z-index="Z_INDEX"
      :color="BACKGROUND_COLOR"
      :opacity="1"
      :class="$style.ProgressCircular"
    >
      <transition name="fade">
        <v-progress-circular
          indeterminate
        />
      </transition>
    </v-overlay>

    <Header
      v-if="isLoggedin"
      :elevation="elevation"
    />
    <NavigationDrawer v-if="isLoggedin" />

    <v-main :style="contentContainerStyles">
      <div
        :ref="SPACER_REF"
        :class="$style.Spacer"
      />
      <nuxt />
      <Overlay
        v-bind="$overlay"
        :style="contentOverlayStyles"
        :class="$style.ContentOverlay"
        @input="onOverlayChanged"
      />
    </v-main>

    <Footer v-if="isLoggedin" />
    <v-divider inset />
    <NavigationFooter v-if="$window.isMobile" />
    <DeviceBar v-if="isAnotherDevicePlaying && $window.isPc" />

    <Toasts />

    <portal-target
      :name="SEARCH_FORM_PORTAL_NAME"
      role="menu"
    />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'typed-vuex';

import Header from '~/components/globals/Header.vue';
import NavigationDrawer from '~/components/globals/NavigationDrawer.vue';
import NavigationFooter from '~/components/globals/NavigationFooter.mobile.vue';
import DeviceBar from '~/components/globals/DeviceBar.vue';
import Footer from '~/components/globals/Footer.vue';
import Toasts from '~/components/globals/Toasts.vue';
import Overlay, { On as OnOverlay } from '~/components/globals/Overlay.vue';
import { $searchForm } from '~/observable/searchForm';
import {
  BACKGROUND_COLOR,
  Z_INDEX_OF,
  HEADER_HEIGHT,
  NAVIGATION_DRAWER_WIDTH,
  FOOTER_HEIGHT,
  NAVIGATION_BAR_HEIGHT,
  DEVICE_BAR_HEIGHT,
} from '~/constants';

const SPACER_REF = 'SPACER_REF';

type Data = {
  isLoaded: boolean
  elevation: number
  observer: IntersectionObserver | undefined
  BACKGROUND_COLOR: string
  Z_INDEX: number
  SPACER_REF: string
  SEARCH_FORM_PORTAL_NAME: string
}

export default Vue.extend({
  components: {
    Header,
    NavigationDrawer,
    Footer,
    NavigationFooter,
    DeviceBar,
    Overlay,
    Toasts,
  },

  data(): Data {
    return {
      isLoaded: false,
      elevation: 0,
      observer: undefined,
      BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.loading,
      SPACER_REF,
      SEARCH_FORM_PORTAL_NAME: $searchForm.PORTAL_NAME,
    };
  },

  computed: {
    isLoggedin(): RootGetters['auth/isLoggedin'] {
      return this.$getters()['auth/isLoggedin'];
    },
    isAnotherDevicePlaying(): boolean {
      return this.$getters()['playback/isAnotherDevicePlaying'];
    },
    contentContainerStyles(): { [k in string]?: string } {
      const gradationHeight = 320;
      const backgroundStyle = this.$getters().backgroundStyles(gradationHeight);
      return backgroundStyle;
    },
    // top は style で設定
    contentOverlayStyles(): { [k in string]?: string } {
      const { isPc } = this.$window;
      // ナビゲーションバーが表示されてるかで変わる
      const left = isPc
        ? `${NAVIGATION_DRAWER_WIDTH}px`
        : '0';

      let footerHeight = FOOTER_HEIGHT;
      // ナビゲーションバーが表示されているとき
      if (!isPc) footerHeight += NAVIGATION_BAR_HEIGHT;
      // 他のデバイスで再生中のとき
      if (this.isAnotherDevicePlaying) footerHeight += DEVICE_BAR_HEIGHT;
      const bottom = `${footerHeight}px`;

      return { left, bottom };
    },
  },

  mounted() {
    this.$window.observe();

    this.isLoaded = true;
    // 初回アクセス時に onSpotifyWebPlaybackSDKReady が呼ばれるので、定義しておく必要がある
    this.$dispatch('player/initPlayer');

    const element = this.$refs[SPACER_REF] as HTMLDivElement;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // intersectionRatio は 0 ~ 1
        this.elevation = Math.ceil(8 * (1 - entry.intersectionRatio));
      });
    }, {
      rootMargin: `-${HEADER_HEIGHT}px 0px`,
    });
    this.observer.observe(element);
  },

  beforeDestroy() {
    this.$window.disconnectObserver();

    if (this.observer != null) {
      this.observer.disconnect();
    }
  },

  methods: {
    onOverlayChanged(value: OnOverlay['input']) {
      this.$overlay.change(value);
    },
  },
});
</script>

<style lang="scss" module>
.Default {
  background-color: $g-background-color !important;
}

.Spacer {
  height: 0;
}

// left, bottom は動的に設定
.ContentOverlay {
  top: $g-header-height;
}

.ProgressCircular {
  bottom: $g-footer-height;
  z-index: z-index-of(loading);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
