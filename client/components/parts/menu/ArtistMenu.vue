<template>
  <v-menu
    offset-x
    left
    :z-index="Z_INDEX"
    :nudge-left="1"
    open-on-hover
  >
    <template #activator="{ on }">
      <v-list-item
        dense
        v-on="on"
        @click.stop
      >
        <v-list-item-title>
          アーティストページに移動
        </v-list-item-title>

        <v-list-item-action>
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>

    <v-list
      dense
      :color="MENU_BACKGROUND_COLOR"
      :elevation="12"
    >
      <v-list-item-group>
        <v-list-item
          v-for="artist in artistList"
          :key="artist.id"
          nuxt
          :to="`/artists/${artist.id}`"
        >
          <v-list-item-title>
            {{ artist.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { App } from '~~/types';

type MenuItem = {
  name: string
  to: string
}

export type Props = {
  artistList: App.SimpleArtistInfo[]
}

type Data = {
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[] | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    return {
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },
});
</script>
