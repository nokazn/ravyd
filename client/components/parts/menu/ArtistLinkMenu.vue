<template>
  <OptionMenu
    offset-x
    :left="left"
    :right="right"
    :nudge-left="1"
    open-on-hover
  >
    <template #activator="{ on }">
      <ChildOptionMenuActivator :on="on">
        アーティストページに移動
      </ChildOptionMenuActivator>
    </template>

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
  </OptionMenu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
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

export default Vue.extend({
  components: {
    OptionMenu,
    ChildOptionMenuActivator,
  },

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

  computed: {
    menuItemList(): MenuItem[] {
      return this.artists.map((artist) => ({
        name: artist.name,
        to: `/artists/${artist.id}`,
        disabled: artist.id === this.$route.params.artistId,
      }));
    },
  },
});
</script>
