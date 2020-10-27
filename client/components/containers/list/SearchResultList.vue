<template>
  <portal :to="SEARCH_FORM_PORTAL_NAME">
    <transition name="fade">
      <v-card
        v-show="menu && query"
        rounded="lg"
        :elevation="12"
        :class="$style.SearchResultList"
        :style="styles"
      >
        <v-list
          dense
          nav
          subheader
          :color="$constant.MENU_BACKGROUND_COLOR"
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
              mdi-alert-circle-outline
            </v-icon>
            "{{ query }}" に一致する項目が見つかりません
          </div>

          <div
            v-show="!isSearching && hasItem"
            class="g-custom-scroll-bar"
            :class="$style.SearchResultList__content"
          >
            <template v-for="{ title, items } in itemMapList">
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
                  <ContentListItem
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :selected="selectedItem != null ? item.id === selectedItem.id : false"
                    @click="onItemClicked"
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
import { defineComponent, computed } from '@vue/composition-api';
import ContentListItem from '~/components/parts/list/ContentListItem.vue';
import { $searchForm } from '~/observable/searchForm';
import { useSearchResult } from '~/services/use/keyboard';
import { SpotifyAPI, App } from '~~/types';

const LIMIT_OF_SEARCH_ITEM = 4;

export type ItemMap = {
  title: string;
  items: App.ContentItem<SpotifyAPI.SearchType>[];
}

export default defineComponent({
  components: {
    ContentListItem,
  },

  setup(_, { root }) {
    const itemMapList = computed<ItemMap[]>(() => {
      return [
        {
          title: '曲',
          items: root.$getters()['search/tracks'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
        {
          title: 'アーティスト',
          items: root.$getters()['search/artists'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
        {
          title: 'アルバム',
          items: root.$getters()['search/albums'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
        {
          title: 'プレイリスト',
          items: root.$getters()['search/playlists'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
        {
          title: 'ポッドキャスト',
          items: root.$getters()['search/shows'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
        {
          title: 'エピソード',
          items: root.$getters()['search/episodes'].slice(0, LIMIT_OF_SEARCH_ITEM),
        },
      ];
    });

    const itemList = computed<App.ContentItem[]>(() => {
      return itemMapList.value.reduce(
        (prev, curr) => [...prev, ...curr.items],
        [] as App.ContentItem<SpotifyAPI.SearchType>[],
      );
    });
    const hasItem = computed(() => itemList.value.length > 0);
    const styles = computed(() => ({
      position: 'fixed',
      top: `${$searchForm.position.top}px`,
      left: `${$searchForm.position.left}px`,
    }));

    const {
      selectedItemIndex,
      query,
      isSearching,
      selectedItem,
      menu,
      onItemClicked,
    } = useSearchResult(root, itemList);

    return {
      selectedItemIndex,
      query,
      isSearching,
      menu,
      itemMapList,
      selectedItem,
      hasItem,
      styles,
      onItemClicked,
      LIMIT_OF_SEARCH_ITEM,
      SEARCH_FORM_PORTAL_NAME: $searchForm.PORTAL_NAME,
    };
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
    // 80vh と 100vh からヘッダーとフッターの高さを除いた高さのうち小さいほう
    max-height: calc(100vh - #{$g-header-height} - #{$g-footer-height} - 48px);
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
