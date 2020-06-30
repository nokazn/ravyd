<template>
  <v-menu
    v-model="menu"
    bottom
    right
    offset-y
    open-on-focus
    :open-on-click="false"
    :nudge-bottom="4"
    :close-on-click="false"
    :close-on-content-click="false"
    :min-width="600"
    :max-width="700"
    :z-index="3000"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="query"
        dense
        hide-details
        rounded
        light
        background-color="white"
        title="検索"
        :class="{
          [$style.SearchField]: true,
          'g-box-shadow': isFocused || isHovered
        }"
        @mouseover="handleIsHovered(true)"
        @mouseout="handleIsHovered(false)"
        @input="debouncedDispatcher"
        @focus="handleIsFocused(true)"
        @blur="handleIsFocused(false)"
        v-on="on"
      >
        <template #prepend-inner>
          <div :class="$style.SearchForm__prependInnerIcon">
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
          <div :class="$style.SearchForm__clearIcon">
            <v-icon
              v-show="query !== ''"
              :size="28"
              color="grey darken-1"
              title="消去"
              @click="clearText"
            >
              mdi-close
            </v-icon>
          </div>
        </template>
      </v-text-field>
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="MENU_BACKGROUND_COLOR"
      >
        <div
          class="g-custom-scroll-bar"
          :class="$style.SearchResultList__content"
        >
          <template v-for="{ title, items } in itemInfoList">
            <template v-if="items.length > 0">
              <v-subheader :key="`${title}-subheader`">
                {{ title }}
              </v-subheader>

              <v-divider :key="`${title}-divider`" />

              <v-list-item-group
                :key="title"
              >
                <SearchResultListItem
                  v-for="item in items"
                  :key="item.id"
                  v-bind="item"
                  @on-clicked="onListItemClicked"
                />
              </v-list-item-group>
            </template>
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
          >
            もっと見る
          </v-btn>
        </div>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';

import SearchResultListItem from '~/components/parts/list/SearchResultListItem.vue';
import { $searchForm } from '~/observable/searchFormState';
import { MENU_BACKGROUND_COLOR } from '~/variables';
import { SpotifyAPI, App } from '~~/types';

export type ItemInfo = {
  title: string
  items: App.ContentItemInfo<SpotifyAPI.SearchType>[]
}

type Data = {
  query: string
  isFocused: boolean
  isHovered: boolean
  debouncedDispatcher: ((query: string) => void) & Cancelable
  MENU_BACKGROUND_COLOR: string
}

export default Vue.extend({
  components: {
    SearchResultListItem,
  },

  props: {
    albums: {
      type: Array as PropType<App.ContentItemInfo<'album'>[]>,
      required: true,
    },
    artists: {
      type: Array as PropType<App.ContentItemInfo<'artist'>[]>,
      required: true,
    },
    tracks: {
      type: Array as PropType<App.ContentItemInfo<'track'>[]>,
      required: true,
    },
    playlists: {
      type: Array as PropType<App.ContentItemInfo<'playlist'>[]>,
      required: true,
    },
    shows: {
      type: Array as PropType<App.ContentItemInfo<'show'>[]>,
      required: true,
    },
    episodes: {
      type: Array as PropType<App.ContentItemInfo<'episode'>[]>,
      required: true,
    },
  },

  data(): Data {
    const interval = 500;
    const debouncedDispatcher = debounce((query: string) => {
      if (query) {
        this.$dispatch('search/searchAllItems', { query });
        $searchForm.handleMenu(true);
      }
    }, interval);

    return {
      query: '',
      isFocused: false,
      isHovered: false,
      debouncedDispatcher,
      MENU_BACKGROUND_COLOR,
    };
  },

  computed: {
    menu: {
      get(): boolean {
        return $searchForm.isMenuShown;
      },
      set(isShown: boolean) {
        $searchForm.handleMenu(isShown);
      },
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
  },

  methods: {
    clearText() {
      this.query = '';
    },
    handleIsFocused(isFocused: boolean) {
      this.isFocused = isFocused;
      if (isFocused) {
        this.menu = true;
      }
    },
    handleIsHovered(isHovered: boolean) {
      this.isHovered = isHovered;
    },
    onListItemClicked() {
      this.menu = false;
    },
  },
});
</script>

<style lang="scss" module>
.SearchResultList {
  &__content {
    max-height: 60vh;
    overflow-y: auto;
  }

  &__moreButton {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}

.SearchForm {
  &__prependInnerIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: -12px;
  }

  &__clearIcon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: -12px;
  }
}
</style>
