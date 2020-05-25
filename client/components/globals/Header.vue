<template>
  <v-app-bar
    v-scroll:#nuxt-content="onScrolled"
    app
    :color="color"
    :elevation="elevation"
    :height="52"
    :class="$style.Header">
    <div :class="$style.Header__container">
      <search-field
        v-model="searchWords"
        :class="$style.Header__searchField" />

      <user-menu />
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootState } from 'vuex';

import SearchField from '~/components/parts/form/SearchField.vue';
import UserMenu from '~/components/containers/menu/UserMenu.vue';
import { HEADER_BACKGROUND_COLOR } from '~/variables';

type Data = {
  HEADER_BACKGROUND_COLOR: typeof HEADER_BACKGROUND_COLOR
  searchWords: string
  elevation: number
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
  },

  data(): Data {
    return {
      HEADER_BACKGROUND_COLOR,
      searchWords: '',
      elevation: 0,
    };
  },

  computed: {
    color(): RootState['dominantBackgroundColor'] {
      return this.$state().dominantBackgroundColor;
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
  },
});
</script>

<style lang="scss" module>
.Header {
  z-index: z-index-of(header)!important;
  &__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0 8px;
  }
  &__searchField {
    width: 20%;
  }
}
</style>
