<template>
  <v-text-field
    ref="SEARCH_FIELD_REF"
    dense
    hide-details
    rounded
    light
    background-color="white"
    placeholder="検索"
    title="検索"
    autocomplete="off"
    aria-autocomplete="none"
    :height="32"
    :value="query"
    :class="{
      [$style.SearchField]: true,
      'g-box-shadow': isFocused || isHovered
    }"
    @input="debouncedDispatcher"
    @mouseover="toggleIsHovered(true)"
    @mouseout="toggleIsHovered(false)"
    @focus="toggleIsFocused(true)"
    @blur="toggleIsFocused(false)"
  >
    <template #prepend-inner>
      <div :class="$style.SearchField__prependInnerIcon">
        <v-icon
          :size="28"
          color="grey darken-4"
          title="検索"
        >
          mdi-magnify
        </v-icon>
      </div>
    </template>

    <template #append>
      <div :class="$style.SearchField__clearIcon">
        <v-btn
          v-show="query !== ''"
          icon
          small
          title="消去"
          @click="clearText"
        >
          <v-icon
            :size="24"
            color="grey"
          >
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref, computed } from '@vue/composition-api';
import { debounce } from 'lodash';
import { $searchForm } from '~/observable/searchForm';
import { useTextField } from '~/services/use/keyboard';

const LIMIT_OF_SEARCH_ITEM = 4;

export default defineComponent({
  setup(_, { root }) {
    const isFocused = ref(false);
    const isHovered = ref(false);
    const SEARCH_FIELD_REF = ref<Vue>();
    const query = ref($searchForm.query);

    const menu = computed<boolean>({
      get() { return $searchForm.isMenuShown; },
      set(value) {
        $searchForm.handleMenu(value);
        // メニュー表示時に overlay も表示
        root.$overlay.change(value);
      },
    });

    const debouncedDispatcher = debounce((q: string) => {
      $searchForm.setQuery(q);
      if (q) {
        $searchForm.handleSearching(true);
        root.$dispatch('search/searchAllItems', {
          // @todo スペースをアンダーバーに置換して1単語として扱う
          query: q.replace(/\s+/g, '_'),
          limit: LIMIT_OF_SEARCH_ITEM,
        }).then(() => {
          $searchForm.handleSearching(false);
        });
      }
    }, 500);

    const toggleIsFocused = (focus: boolean) => {
      isFocused.value = focus;
      const element = SEARCH_FIELD_REF.value?.$el;
      // フォーカスされたらメニューの位置を計算する
      if (focus && element != null) {
        const { clientHeight } = element;
        const { x, y } = element.getBoundingClientRect();
        const offsetY = 4;
        const top = Math.ceil(y) + clientHeight + offsetY;
        const left = Math.ceil(x);
        $searchForm.setPosition(top, left);
      }
      menu.value = focus;
    };
    const toggleIsHovered = (hover: boolean) => { isHovered.value = hover; };
    const clearText = () => { query.value = ''; };
    const onListItemClicked = () => { menu.value = false; };

    useTextField(root, 'search', SEARCH_FIELD_REF);

    return {
      isFocused,
      isHovered,
      debouncedDispatcher,
      query,
      menu,
      SEARCH_FIELD_REF,
      toggleIsFocused,
      toggleIsHovered,
      clearText,
      onListItemClicked,
    };
  },
});
</script>

<style lang="scss" module>
.SearchField {
  width: 240px;

  &__prependInnerIcon {
    display: inline-flex;
    align-items: center;
    height: 32px;
    margin-left: -12px;
  }

  &__clearIcon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    height: 32px;
    margin-right: -12px;
  }
}
</style>
