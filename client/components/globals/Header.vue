<template>
  <v-app-bar
    app
    :elevation="headerElevation"
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

      <div :class="$style.Header__right">
        <template v-if="$header.hasAdditionalContent">
          <transition name="fade">
            <portal-target
              v-show="$header.isAdditionalContentShown"
              :name="$header.PORTAL_NAME"
              :class="$style.Header__additional"
            />
          </transition>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

import SearchField from '~/components/containers/form/SearchField.vue';
import SearchResultList from '~/components/containers/list/SearchResultList.vue';
import { HEADER_HEIGHT, BACKGROUND_COLOR } from '~/constants';

type Data = {
  HEADER_HEIGHT: number
}

type HeaderStyles = {
  backgroundColor: string
  backdropFilter?: string
}

export default Vue.extend({
  components: {
    SearchField,
    SearchResultList,
  },

  props: {
    elevation: {
      type: Number,
      required: true,
    },
  },

  data(): Data {
    return {
      HEADER_HEIGHT,
    };
  },

  computed: {
    styles(): HeaderStyles {
      const backgroundStyles = this.$getters().headerStyles;
      const { backdropFiltered } = this.$header;
      if (backdropFiltered) {
        return {
          ...backgroundStyles,
          backdropFilter: 'blur(16px)',
        };
      }

      const dominantColor = this.$state().dominantBackgroundColor;
      return {
        backgroundColor: dominantColor?.hex ?? BACKGROUND_COLOR,
      };
    },
    // backdrop-filter が有効のときはヘッダーの下に sticky なコンテンツがないので elavation を有効にする
    headerElevation(): number {
      const { backdropFiltered } = this.$header;
      return backdropFiltered
        ? this.elevation
        : 0;
    },
  },

  methods: {
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

  &__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
  }

  &__searchForm {
    margin-left: 20px;
  }
}
</style>
