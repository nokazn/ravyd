<template>
  <portal to="searchResultList">
    <transition name="fade">
      <v-card
        v-show="menu && query"
        :elevation="12"
        :class="$style.SearchResultList"
        :style="styles"
      >
        <v-list
          dense
          subheader
          :color="MENU_BACKGROUND_COLOR"
        >
          <div
            v-show="isSearching"
            :class="$style['SearchResultList__content--searching']"
          >
            <v-progress-circular indeterminate />
          </div>

          <div
            v-show="!isSearching && !hasItem"
            :class="$style['SearchResultList__content--empty']"
          >
            <v-icon left>
              mdi-help-circle-outline
            </v-icon>
            "{{ query }}" に一致する項目が見つかりません
          </div>

          <div
            v-show="!isSearching && hasItem"
            class="g-custom-scroll-bar"
            :class="$style.SearchResultList__content"
          >
            <template v-for="{ title, items } in itemInfoList">
              <div
                v-if="items.length > 0"
                :key="title"
                :class="$style.SearchResultList__group"
              >
                <v-subheader>
                  {{ title }}
                </v-subheader>

                <v-divider />

                <v-list-item-group>
                  <SearchResultListItem
                    v-for="item in items"
                    :key="item.id"
                    v-bind="item"
                    :is-selected="selectedItem != null ? item.id === selectedItem.id : false"
                    @on-clicked="onItemClicked"
                  />
                </v-list-item-group>
              </div>
            </template>
          </div>

          <v-divider />

          <div :class="$style.SearchResultList__moreButton">
            <v-btn
              rounded
              text
              small
              nuxt
              to="/search"
              class="g-no-text-decoration"
            >
              <v-icon
                left
                small
              >
                mdi-magnify
              </v-icon>
              もっと見る
            </v-btn>
          </div>
        </v-list>
      </v-card>
    </transition>
  </portal>
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'vuex';
import { RawLocation } from 'vue-router';

import SearchResultListItem from '~/components/parts/list/SearchResultListItem.vue';
import { $searchForm } from '~/observable/searchForm';
import { MENU_BACKGROUND_COLOR } from '~/variables';
import { SpotifyAPI, App } from '~~/types';

const LIMIT_OF_SEARCH_ITEM = 4;

type Data = {
  selectedItemIndex: number | undefined
  keyEventListener: ((e: KeyboardEvent) => void) | undefined
  MENU_BACKGROUND_COLOR: string
  LIMIT_OF_SEARCH_ITEM: number
}

export type ItemInfo = {
  title: string
  items: App.ContentItemInfo<SpotifyAPI.SearchType>[]
}

export default Vue.extend({
  components: {
    SearchResultListItem,
  },

  data(): Data {
    return {
      selectedItemIndex: undefined,
      keyEventListener: undefined,
      MENU_BACKGROUND_COLOR,
      LIMIT_OF_SEARCH_ITEM,
    };
  },

  computed: {
    query(): string {
      return $searchForm.query;
    },
    isSearching(): boolean {
      return $searchForm.isSearching;
    },
    menu: {
      get(): boolean {
        return $searchForm.isMenuShown;
      },
      set(isShown: boolean) {
        $searchForm.handleMenu(isShown);
      },
    },
    styles() {
      const { top, left } = $searchForm.position;

      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      };
    },
    tracks(): RootGetters['search/tracks'] {
      return this.$getters()['search/tracks'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    artists(): RootGetters['search/artists'] {
      return this.$getters()['search/artists'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    albums(): RootGetters['search/albums'] {
      return this.$getters()['search/albums'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    playlists(): RootGetters['search/playlists'] {
      return this.$getters()['search/playlists'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    shows(): RootGetters['search/shows'] {
      return this.$getters()['search/shows'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    episodes(): RootGetters['search/episodes'] {
      return this.$getters()['search/episodes'].slice(0, LIMIT_OF_SEARCH_ITEM);
    },
    itemInfoList(): ItemInfo[] {
      const itemInfoList = [
        {
          title: '曲',
          items: this.tracks,
        },
        {
          title: 'アーティスト',
          items: this.artists,
        },
        {
          title: 'アルバム',
          items: this.albums,
        },
        {
          title: 'プレイリスト',
          items: this.playlists,
        },
        {
          title: 'ポッドキャスト',
          items: this.shows,
        },
        {
          title: 'エピソード',
          items: this.episodes,
        },
      ];

      return itemInfoList;
    },
    itemList(): App.ContentItemInfo<SpotifyAPI.SearchType>[] {
      return this.itemInfoList.reduce(
        (prev, curr) => [...prev, ...curr.items],
        [] as App.ContentItemInfo<SpotifyAPI.SearchType>[],
      );
    },
    selectedItem(): App.ContentItemInfo<SpotifyAPI.SearchType> | undefined {
      return this.selectedItemIndex != null
        ? this.itemList[this.selectedItemIndex] ?? undefined
        : undefined;
    },
    hasItem(): boolean {
      return this.itemList.length > 0;
    },
  },

  watch: {
    // 検索用のクエリが変化するたびに初期化
    query() {
      this.selectedItemIndex = undefined;
    },
  },

  mounted() {
    const keyEventListener = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          this.handleSelectedItem(1);
          break;

        case 'ArrowUp':
          this.handleSelectedItem(-1);
          break;

        case 'Enter':
          // 項目が選択されていたらページ遷移
          if (this.selectedItem != null) {
            this.onItemEntered(this.selectedItem.to);
          }
          break;

        default:
          break;
      }
    };

    window.document.addEventListener('keydown', keyEventListener);
    this.keyEventListener = keyEventListener;
  },

  beforeDestroy() {
    if (this.keyEventListener != null) {
      window.document.removeEventListener('keydown', this.keyEventListener);
    }
  },

  methods: {
    onItemClicked() {
      this.menu = false;
      this.$overlay.change(false);
    },
    handleSelectedItem(diff: 1 | -1) {
      const { length } = this.itemList;
      // 未選択の場合は down/up を押したときにそれぞれ 最初/最後 が選択されるようにする
      const currentIndex = this.selectedItemIndex ?? (diff > 0 ? -1 : 0);
      this.selectedItemIndex = (diff + currentIndex + length) % length;
    },
    onItemEntered(to: string | RawLocation) {
      this.$router.push(to);
      this.menu = false;
      this.$overlay.change(false);
    },
  },
});
</script>

<style lang="scss" module>
.SearchResultList {
  min-width: 400px;
  z-index: z-index-of(front-menu);

  &__content {
    min-width: 400px;
    max-width: 60vw;
    max-height: 60vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 12px;
    padding: 0 12px;

    &--searching,
    &--empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 120px;
      padding: 0 24px;
    }
  }

  &__group {
    max-width: calc(30vw - 18px);
    margin-bottom: 12px;
  }

  &__moreButton {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
