<template>
  <v-app-bar
    app
    :color="BAR_BACKGROUND_COLOR"
    :height="52">
    <div :class="$style.Header">
      <search-field
        v-model="searchWords"
        :class="$style.Header__searchField" />

      <user-menu />
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

import SearchField from '~/components/parts/form/SearchField.vue';
import UserMenu from '~/components/containers/menu/UserMenu.vue';

import { BAR_BACKGROUND_COLOR } from '~/variables';

type Data = {
  BAR_BACKGROUND_COLOR: typeof BAR_BACKGROUND_COLOR
  searchWords: string
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
  },

  data(): Data {
    return {
      BAR_BACKGROUND_COLOR,
      searchWords: '',
    };
  },
});
</script>

<style lang="scss" module>
.Header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 8px;
  z-index: z-index-of(header);
  &__searchField {
    width: 20%;
  }
}
</style>
