<template>
  <v-app dark>
    <Header
      v-if="isLoggedin"
      :elevation="elevation"
    />
    <NavigationDrawer v-if="isLoggedin" />

    <main
      :class="$style.ContentContainer"
      :style="styles"
    >
      <div
        :ref="SPACER_REF"
        :class="$style.Spacer"
      />

      <nuxt />

      <Overlay
        v-bind="$overlay"
        :class="$style.ContentOverlay"
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

    <v-overlay
      v-if="!onLoaded"
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
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import Header from '~/components/globals/Header.vue';
import NavigationDrawer from '~/components/globals/NavigationDrawer.vue';
import Footer from '~/components/globals/Footer.vue';
import Toast, { On as OnToast } from '~/components/globals/Toast.vue';
import Overlay, { On as OnOverlay } from '~/components/globals/Overlay.vue';
import { $searchForm } from '~/observable/searchForm';
import { BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';

const SPACER_REF = 'SPACER_REF';

type Data = {
  onLoaded: boolean
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
      onLoaded: false,
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
    styles(): RootGetters['backgroundStyles'] {
      return this.$getters().backgroundStyles;
    },
  },

  mounted() {
    this.onLoaded = true;
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
.ContentContainer {
  padding: 0 0 $g-footer-height $g-navigation-drawer-width;
}

.Spacer {
  height: $g-header-height;
}

.ContentOverlay {
  top: $g-header-height;
  bottom: $g-footer-height;
  left: $g-navigation-drawer-width;
}

.ProgressCircular {
  z-index: z-index-of(loading);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
