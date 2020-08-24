<template>
  <v-menu
    offset-x
    :left="left"
    :right="right"
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
          v-for="item in menuItemList"
          :key="item.to"
          nuxt
          :to="item.to"
          :disabled="item.disabled"
          :inactive="item.disabled"
        >
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/constants';
import { App } from '~~/types';

type MenuItem = {
  name: string
  to: string
  disabled: boolean
}

export type Props = {
  artists: App.SimpleArtistInfo[]
  left?: boolean
  right?: boolean
}

type Data = {
  menuItemList: MenuItem[]
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  props: {
    artists: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    const menuItemList = this.artists.map((artist) => ({
      name: artist.name,
      to: `/artists/${artist.id}`,
      disabled: artist.id === this.$route.params.artistId,
    }));

    return {
      menuItemList,
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },
});
</script>
