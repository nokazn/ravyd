<template>
  <v-app-bar
    app
    :height="48">
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

type Data = {
  searchWords: string
}

export default Vue.extend({
  components: {
    SearchField,
    UserMenu,
  },

  data(): Data {
    return {
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
  &__searchField {
    width: 20%;
  }
}
</style>
