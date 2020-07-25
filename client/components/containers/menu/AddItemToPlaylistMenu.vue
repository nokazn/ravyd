<template>
  <v-menu
    offset-x
    :left="left"
    :right="right"
    :z-index="Z_INDEX"
    :nudge-left="1"
    open-on-hover
    open-on-click
  >
    <template #activator="{ on }">
      <v-list-item
        dense
        v-on="on"
        @click.stop
      >
        <v-list-item-title>
          プレイリストに追加
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
          dense
          title="新規プレイリスト"
          @click="onNewPlaylistClicked"
        >
          <v-list-item-title>
            新規プレイリスト
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>

      <v-divider />

      <v-list-item-group>
        <v-virtual-scroll
          :items="ownPlaylists"
          :item-height="36"
          height="400px"
          class="g-custom-scroll-bar"
        >
          <template #default="{ item }">
            <v-list-item
              dense
              :title="item.name"
              @click="onItemClicked(item)"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootGetters } from 'typed-vuex';

import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { SpotifyAPI, App } from '~~/types';

export type Props = {
  name: string
  uriList: string[]
  artists: App.SimpleArtistInfo[] | string | undefined
  left?: boolean
  right?: boolean
}

type Data = {
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    uriList: {
      type: Array as PropType<string[]>,
      required: true,
    },
    artists: {
      type: [Array, String] as PropType<App.SimpleArtistInfo[] | string | undefined>,
      default: undefined,
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
    return {
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    ownPlaylists(): RootGetters['playlists/ownPlaylists'] {
      return this.$getters()['playlists/ownPlaylists'];
    },
  },

  methods: {
    onNewPlaylistClicked() {
      const { artists, name } = this;
      const artistName = Array.isArray(artists)
        ? artists.map((artist) => artist.name).join(', ')
        : artists;
      const title = artistName != null
        ? `${name} - ${artistName}`
        : name;

      this.$dispatch('playlists/createPlaylist', {
        name,
        description: '',
        uriList: this.uriList,
      }).then(() => {
        this.$toast.show('primary', `"${title}" を新規プレイリストに追加しました。`);
      }).catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', `"${title}" を新規プレイリストに追加できませんでした。`);
      });
    },
    onItemClicked(playlist: SpotifyAPI.SimplePlaylist) {
      this.$dispatch('playlists/addItemToPlaylist', {
        playlistId: playlist.id,
        playlistName: playlist.name,
        uriList: this.uriList,
        name: this.name,
      });
    },
  },
});
</script>
