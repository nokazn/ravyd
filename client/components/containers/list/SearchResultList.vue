<template>
  <portal :to="SEARCH_FORM_PORTAL_NAME">
    <transition name="fade">
      <div
        v-show="menu && query"
        :style="styles"
        :class="$style.SearchResultList"
      >
        <v-card rounded="lg">
          <v-list
            dense
            nav
            subheader
            :elevation="12"
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
                      :selected="isSelected(item.id)"
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
      </div>
    </transition>
  </portal>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import ContentListItem from '~/components/parts/list/ContentListItem.vue';
import { $searchForm } from '~/observable/searchForm';
import { useSearchResult } from '~/use/keyboard';
import { useContentPosition } from '~/use/style';
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

    const {
      selectedItemIndex,
      query,
      isSearching,
      selectedItem,
      menu,
    } = useSearchResult(root, itemList);
    const styles = useContentPosition(root);

    const isSelected = (id: string) => {
      return selectedItem.value != null
        ? id === selectedItem.value.id
        : false;
    };

    return {
      selectedItemIndex,
      query,
      isSearching,
      menu,
      itemMapList,
      selectedItem,
      hasItem,
      isSelected,
      styles,
      LIMIT_OF_SEARCH_ITEM,
      SEARCH_FORM_PORTAL_NAME: $searchForm.PORTAL_NAME,
    };
  },
});
</script>

<style lang="scss" module>
.SearchResultList {
  $content-side-padding: 12px;
  $content-width: 90vw;
  $content-max-width: 1200px;
  $card-footer-height: 48px;

  min-width: min(87.5vw, 400px);
  margin: -4px 4% 0;
  z-index: z-index-of(front-menu);

  &__content {
    overflow-y: auto;
    padding: 0 $content-side-padding;

    @include smaller-than-lg() {
      $footer-height: $g-navigation-bar-height + $g-footer-height-mobile;
      $extra-height: $g-header-height + $card-footer-height + $footer-height;

      max-width: $content-width;
      max-height: calc(100vh - #{$extra-height});
    }

    @include larger-than-lg() {
      $flexible-max-width: calc(#{$content-width} - #{$g-navigation-drawer-width * 0.9});
      $extra-height: $g-header-height + $card-footer-height + $g-footer-height;

      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: $content-side-padding;
      max-width: min(#{$flexible-max-width}, #{$content-max-width});
      max-height: calc(100vh - #{$extra-height});
    }

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
    margin-bottom: 12px;

    @include smaller-than-lg() {
      max-width: calc(#{$content-width} - #{$content-side-padding * 2});
    }

    @include larger-than-lg() {
      $content-width-with-nav: calc((#{$content-width} - #{$g-navigation-drawer-width}) / 2);
      $flexible-max-width: calc((#{$content-width} - #{$g-navigation-drawer-width}) / 2);

      max-width: min(#{$flexible-max-width}, #{$content-width / 2});
    }
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
