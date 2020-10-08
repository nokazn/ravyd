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
        プレイリストに追加
      </ChildOptionMenuActivator>
    </template>

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
  </OptionMenu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootGetters } from 'typed-vuex';

import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
import { SpotifyAPI, App } from '~~/types';

export type Props = {
  name: string
  uriList: string[]
  artists: App.SimpleArtistInfo[] | string | undefined
  left?: boolean
  right?: boolean
}

export default Vue.extend({
  components: {
    OptionMenu,
    ChildOptionMenuActivator,
  },

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
        name: title,
        description: '',
        uriList: this.uriList,
      }).then(() => {
        this.$toast.push({
          color: 'primary',
          message: `"${title}" を新規プレイリストに追加しました。`,
        });
      }).catch((err: Error) => {
        console.error({ err });
        this.$toast.push({
          color: 'error',
          message: `"${title}" を新規プレイリストに追加できませんでした。`,
        });
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
