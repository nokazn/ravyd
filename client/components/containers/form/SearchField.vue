<template>
  <v-text-field
    :ref="SEARCH_FIELD_REF"
    :value="query"
    dense
    hide-details
    rounded
    light
    :height="32"
    background-color="white"
    placeholder="検索"
    title="検索"
    autocomplete="off"
    aria-autocomplete="none"
    :class="{
      [$style.SearchField]: true,
      'g-box-shadow': isFocused || isHovered
    }"
    @mouseover="handleIsHovered(true)"
    @mouseout="handleIsHovered(false)"
    @input="debouncedDispatcher"
    @focus="handleIsFocused(true)"
    @blur="handleIsFocused(false)"
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
        <v-icon
          v-show="query !== ''"
          :size="24"
          color="grey"
          title="消去"
          @click="clearText"
        >
          mdi-close
        </v-icon>
      </div>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';

import { $searchForm } from '~/observable/searchForm';
import { SpotifyAPI, App } from '~~/types';

const SEARCH_FIELD_REF = 'searchField';
const LIMIT_OF_SEARCH_ITEM = 4;

type ItemInfo = {
  title: string
  items: App.ContentItemInfo<SpotifyAPI.SearchType>[]
}

type Data = {
  isFocused: boolean
  isHovered: boolean
  debouncedDispatcher: ((query: string) => void) & Cancelable
  keyEventListener: ((e: KeyboardEvent) => void) | undefined
  SEARCH_FIELD_REF: string
}

export default Vue.extend({
  data(): Data {
    const interval = 500;
    const debouncedDispatcher = debounce((query: string) => {
      $searchForm.setQuery(query);
      if (query) {
        $searchForm.handleSearching(true);
        this.$dispatch('search/searchAllItems', {
          // スペースをアンダーバーに置換して1単語として扱う
          query: query.replace(/\s+/g, '_'),
          limit: LIMIT_OF_SEARCH_ITEM,
        }).then(() => {
          $searchForm.handleSearching(false);
        });

        // クエリが更新されたらメニューを閉じていても再表示
        this.$nextTick().then(() => {
          $searchForm.handleMenu(true);
          this.$overlay.change(true);
        });
      }
    }, interval);

    return {
      isFocused: false,
      isHovered: false,
      debouncedDispatcher,
      keyEventListener: undefined,
      SEARCH_FIELD_REF,
    };
  },

  computed: {
    query: {
      get(): string {
        return $searchForm.query;
      },
      set(query: string) {
        $searchForm.setQuery(query);
      },
    },
    menu: {
      get(): boolean {
        return $searchForm.isMenuShown;
      },
      set(isShown: boolean) {
        $searchForm.handleMenu(isShown);
        // メニュー表示時に overlay も表示
        this.$overlay.change(isShown);
      },
    },
  },

  mounted() {
    // @as v-text-field は focus と blur ハンドラが存在
    const ref = this.$refs[this.SEARCH_FIELD_REF] as Vue & { focus(): void, blur(): void };
    const keyEventListener = (e: KeyboardEvent) => {
      switch (e.key) {
        case '/':
          ref.focus();
          break;

        case 'Escape':
          ref.blur();
          break;

        default:
          break;
      }
    };

    window.document.addEventListener('keyup', keyEventListener);
    this.keyEventListener = keyEventListener;
  },

  beforeDestroy() {
    if (this.keyEventListener != null) {
      window.document.removeEventListener('keyup', this.keyEventListener);
    }
  },

  methods: {
    handleIsFocused(isFocused: boolean) {
      this.isFocused = isFocused;

      // フォーカスされたらメニューの位置を計算する
      if (isFocused) {
        const ref = this.$refs[SEARCH_FIELD_REF] as Vue;
        const { clientHeight } = ref.$el;
        const { x, y } = ref.$el.getBoundingClientRect();
        const offsetY = 4;
        const top = Math.ceil(y) + clientHeight + offsetY;
        const left = Math.ceil(x);
        $searchForm.setPosition(top, left);
      }

      // フォーカスの有無でメニューの表示が決まる
      this.menu = isFocused;
    },
    handleIsHovered(isHovered: boolean) {
      this.isHovered = isHovered;
    },
    clearText() {
      this.query = '';
    },
    onListItemClicked() {
      this.menu = false;
    },
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
