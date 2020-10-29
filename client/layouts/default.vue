<template>
  <v-app
    dark
    :class="$style.Default"
  >
    <WaveLoader v-if="!isLoaded" />

    <Header
      v-if="isLoggedin"
      :elevation="elevation"
    />
    <NavigationDrawer v-if="isLoggedin" />

    <v-main :style="contentContainerStyles">
      <div
        ref="SPACER_REF"
        :class="$style.Spacer"
      />
      <nuxt />
      <Overlay />
    </v-main>

    <template v-if="isLoggedin">
      <PlayerBar />
      <NavigationBar v-if="$screen.isMobile" />
      <DeviceBar v-if="isAnotherDevicePlaying && $screen.isPc" />
    </template>

    <Toasts />
    <ConfirmModal />
    <portal-target
      v-if="$screen.isSingleColumn"
      v-show="$header.isFabShown"
      :name="$header.PORTAL_NAME"
      :class="$style.Fab"
    />
    <portal-target
      role="menu"
      :name="SEARCH_FORM_PORTAL_NAME"
    />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from '@vue/composition-api';

import WaveLoader from '~/components/globals/WaveLoader.vue';
import Header from '~/components/globals/Header.vue';
import NavigationDrawer from '~/components/globals/NavigationDrawer.vue';
import PlayerBar from '~/components/globals/PlayerBar.vue';
import NavigationBar from '~/components/globals/NavigationBar.mobile.vue';
import DeviceBar from '~/components/globals/DeviceBar.vue';
import Overlay from '~/components/globals/Overlay.vue';
import Toasts from '~/components/globals/Toasts.vue';
import ConfirmModal from '~/components/globals/ConfirmModal.vue';

import { useIntersectionObserver } from '~/use/observer';
import { useIsLoaded } from '~/use/util';
import { $searchForm } from '~/observable/searchForm';

export default defineComponent({
  components: {
    WaveLoader,
    Header,
    NavigationDrawer,
    PlayerBar,
    NavigationBar,
    DeviceBar,
    Overlay,
    Toasts,
    ConfirmModal,
  },

  setup(_, { root }) {
    const isLoaded = useIsLoaded();
    const elevation = ref(0);
    const SPACER_REF = ref<HTMLDivElement>();

    useIntersectionObserver(SPACER_REF, (entry) => {
      // intersectionRatio は 0 ~ 1
      elevation.value = Math.ceil(8 * (1 - entry.intersectionRatio));
    }, {
      rootMargin: `-${root.$constant.HEADER_HEIGHT}px 0px`,
    });
    const isLoggedin = computed(() => root.$getters()['auth/isLoggedin']);
    const isAnotherDevicePlaying = computed(() => root.$getters()['playback/isAnotherDevicePlaying']);
    const contentContainerStyles = computed(() => root.$getters().backgroundStyles(320));

    onMounted(() => {
      root.$screen.observe();
      // 初回アクセス時に onSpotifyWebPlaybackSDKReady が呼ばれるので、定義しておく必要がある
      root.$dispatch('player/initPlayer');
    });
    onBeforeUnmount(() => {
      root.$screen.disconnectObserver();
    });

    return {
      isLoaded,
      elevation,
      isLoggedin,
      isAnotherDevicePlaying,
      contentContainerStyles,
      SPACER_REF,
      SEARCH_FORM_PORTAL_NAME: $searchForm.PORTAL_NAME,
    };
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

.Fab {
  position: fixed;
  top: calc(#{$g-header-height} + 2%);
  right: 2%;
  z-index: z-index-of(fab);
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
