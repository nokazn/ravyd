<template>
  <div>
    <SearchField
      :query.sync="query"
      :menu.sync="menu"
      :searching.sync="isSearching"
    />
    <SearchResultList
      :query.sync="query"
      :menu.sync="menu"
      :searching.sync="isSearching"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';
import SearchField from '~/components/containers/form/SearchField.vue';
import SearchResultList from '~/components/containers/list/SearchResultList.vue';

export default defineComponent({
  components: {
    SearchField,
    SearchResultList,
  },

  setup(_, { root }) {
    const query = ref('');
    const menu = ref(false);
    const isSearching = ref(false);

    watch(menu, (v) => { root.$overlay.change(v); });

    return {
      query,
      menu,
      isSearching,
    };
  },
});
</script>
