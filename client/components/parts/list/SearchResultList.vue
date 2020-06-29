<template>
  <v-menu
    v-model="menu"
    bottom
    right
    offset-y
    :close-on-click="false"
    :close-on-content-click="false"
    :min-width="600"
    :max-width="700"
    :max-height="400"
    :z-index="10000"
  >
    <template #activator="{ on }">
      <slot
        name="activator"
        v-on="on"
      />
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="MENU_BACKGROUND_COLOR"
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
              />
            </v-list-item-group>
          </template>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import SearchResultListItem from '~/components/parts/list/SearchResultListItem.vue';
import { $searchForm } from '~/observable/searchFormState';
import { MENU_BACKGROUND_COLOR } from '~/variables';
import { SpotifyAPI, App } from '~~/types';

export type ItemInfo = {
  title: string
  items: App.ContentItemInfo<SpotifyAPI.SearchType>[]
}

type Data = {
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
    return {
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
});
</script>
