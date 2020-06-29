<template>
  <div>
    <SearchResultList
      :tracks="tracks"
      :artists="artists"
      :albums="albums"
      :playlists="playlists"
      :shows="shows"
      :episodes="episodes"
    >
      <template #activator>
        <SearchField
          @on-input="onInput"
        />
      </template>
    </SearchResultList>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';

import SearchField, { On as OnSearch } from '~/components/parts/form/SearchField.vue';
import SearchResultList from '~/components/parts/list/SearchResultList.vue';

const MAX_LIST_LENGT = 5;

export default Vue.extend({
  components: {
    SearchField,
    SearchResultList,
  },

  computed: {
    tracks(): RootGetters['search/tracks'] {
      return this.$getters()['search/tracks'].slice(0, MAX_LIST_LENGT);
    },
    artists(): RootGetters['search/artists'] {
      return this.$getters()['search/artists'].slice(0, MAX_LIST_LENGT);
    },
    albums(): RootGetters['search/albums'] {
      return this.$getters()['search/albums'].slice(0, MAX_LIST_LENGT);
    },
    playlists(): RootGetters['search/playlists'] {
      return this.$getters()['search/playlists'].slice(0, MAX_LIST_LENGT);
    },
    shows(): RootGetters['search/shows'] {
      return this.$getters()['search/shows'].slice(0, MAX_LIST_LENGT);
    },
    episodes(): RootGetters['search/episodes'] {
      return this.$getters()['search/episodes'].slice(0, MAX_LIST_LENGT);
    },
  },

  methods: {
    onInput(query: OnSearch['on-input']) {
      this.$dispatch('search/searchAllItems', { query });
    },
  },
});
</script>
