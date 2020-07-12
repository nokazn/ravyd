<template>
  <v-app-bar
    v-scroll="onScrolled"
    app
    :elevation="elevation"
    :height="HEADER_HEIGHT"
    :style="styles"
    :class="$style.Header"
  >
    <div :class="$style.Header__container">
      <div :class="$style.Header__left">
        <v-btn
          :width="36"
          :height="36"
          icon
          title="戻る"
          @click="onBackButtonClicked"
        >
          <v-icon :size="32">
            mdi-chevron-left
          </v-icon>
        </v-btn>

        <v-btn
          :width="36"
          :height="36"
          icon
          title="進む"
          @click="onForwardButtonClicked"
        >
          <v-icon :size="32">
            mdi-chevron-right
          </v-icon>
        </v-btn>

        <div :class="$style.Header__searchForm">
          <SearchField />
          <SearchResultList />
        </div>
      </div>

      <div :class="$style.Header__right" />
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

import SearchField from '~/components/containers/form/SearchField.vue';
import SearchResultList from '~/components/containers/list/SearchResultList.vue';
import { HEADER_BACKGROUND_COLOR_RGB, DARKEN_FILTER_RATIO, HEADER_HEIGHT } from '~/variables';
import { App } from '~~/types';

type Data = {
  elevation: number
  HEADER_HEIGHT: number
}

export default Vue.extend({
  components: {
    SearchField,
    SearchResultList,
  },

  data(): Data {
    return {
      elevation: 0,
      HEADER_HEIGHT,
    };
  },

  computed: {
    styles(): { backgroundColor: string } {
      const rgbList = this.$state().dominantBackgroundColor?.rgb
        ?.map((color) => color * DARKEN_FILTER_RATIO) as App.DominantColorInfo['rgb'] ?? HEADER_BACKGROUND_COLOR_RGB;

      return { backgroundColor: `rgba(${rgbList.join(',')},0.6)` };
    },
  },

  methods: {
    onScrolled(e: { target?: HTMLDivElement }) {
      const scrollTop = e.target?.scrollTop as number;
      if (scrollTop == null) return;

      this.elevation = scrollTop < 120
        ? scrollTop / 5
        : 24;
    },
    onBackButtonClicked() {
      this.$router.back();
    },
    onForwardButtonClicked() {
      this.$router.forward();
    },
  },
});
</script>

<style lang="scss" module>
.Header {
  z-index: z-index-of(header) !important;
  backdrop-filter: blur(16px);

  &__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0 8px;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  &__searchForm {
    margin-left: 20px;
  }
}
</style>
