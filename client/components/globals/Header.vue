<template>
  <v-app-bar
    app
    :elevation="elevation"
    :height="HEADER_HEIGHT"
    :extended="$header.isExtended"
    :extension-height="$header.extensionHeight"
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

    <template #extension>
      <transition name="fade">
        <portal-target
          v-show="$header.isExtended"
          :name="$header.PORTAL_NAME"
          :class="$style.Header__extension"
        />
      </transition>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import SearchField from '~/components/containers/form/SearchField.vue';
import SearchResultList from '~/components/containers/list/SearchResultList.vue';
import { HEADER_HEIGHT } from '~/variables';

type Data = {
  HEADER_HEIGHT: number
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
    styles(): RootGetters['headerStyles'] {
      return this.$getters().headerStyles;
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
  backdrop-filter: blur(16px);

  &__main,
  &__extension > *:first-child {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
  }

  &__extension {
    width: 100%;
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
