<template>
  <v-app dark>
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

    <main :style="contentContainerStyles">
      <div
        :ref="SPACER_REF"
        :class="$style.Spacer"
      />
      <nuxt />
      <Overlay
        v-bind="$overlay"
        :style="contentOverlayStyles"
        @on-changed="onOverlayChanged"
      />
    </main>

    <Footer v-if="isLoggedin" />

    <Toast
      v-bind="$toast"
      @on-changed="onToastChanged"
    />

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
import Footer from '~/components/globals/Footer.vue';
import Toast, { On as OnToast } from '~/components/globals/Toast.vue';
import Overlay, { On as OnOverlay } from '~/components/globals/Overlay.vue';
import { $searchForm } from '~/observable/searchForm';
import {
  BACKGROUND_COLOR,
  Z_INDEX_OF,
  HEADER_HEIGHT,
  FOOTER_HEIGHT,
  DEVICE_BAR_HEIGHT,
  NAVIGATION_DRAWER_WIDTH,
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
    Overlay,
    Toast,
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
      const backgroundStyle = this.$getters().backgroundStyles(320);
      const padding = this.isAnotherDevicePlaying
        ? `0 0 calc(${FOOTER_HEIGHT}px + ${DEVICE_BAR_HEIGHT}px) ${NAVIGATION_DRAWER_WIDTH}px`
        : `0 0 ${FOOTER_HEIGHT}px ${NAVIGATION_DRAWER_WIDTH}px`;

      return {
        ...backgroundStyle,
        padding,
      };
    },
    contentOverlayStyles(): { [k in string]?: string } {
      const top = `${HEADER_HEIGHT}px`;
      const left = `${NAVIGATION_DRAWER_WIDTH}px`;
      const bottom = this.isAnotherDevicePlaying
        ? `calc(${FOOTER_HEIGHT}px + ${DEVICE_BAR_HEIGHT})px`
        : `${FOOTER_HEIGHT}px`;

      return { top, bottom, left };
    },
  },

  mounted() {
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
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });
    this.observer.observe(element);
  },

  beforeDestroy() {
    if (this.observer != null) {
      this.observer.disconnect();
    }
  },

  methods: {
    onOverlayChanged(isShown: OnOverlay['on-changed']) {
      this.$overlay.change(isShown);
    },
    onToastChanged(isShown: OnToast['on-changed']) {
      this.$toast.change(isShown);
    },
  },
});
</script>

<style lang="scss" module>
/* .ContentContainer {
  padding: 0 0 $g-footer-height $g-navigation-drawer-width;
} */

.Spacer {
  height: $g-header-height;
}

/* .ContentOverlay {
  top: $g-header-height;
  bottom: $g-footer-height;
  left: $g-navigation-drawer-width;
} */

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
