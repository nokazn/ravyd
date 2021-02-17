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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { SpotifyAPI } from 'shared/types';
import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import ChildOptionMenuActivator from '~/components/parts/menu/ChildOptionMenuActivator.vue';
import type { App } from '~/entities';

export default defineComponent({
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
      type: [Array, String] as PropType<App.MinimumArtist[] | string | undefined>,
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

  setup(props, { root }) {
    const ownPlaylists = computed(() => root.$getters()['playlists/ownPlaylists']);
    const onNewPlaylistClicked = () => {
      const { artists, name } = props;
      const artistName = Array.isArray(artists)
        ? artists.map((artist) => artist.name).join(', ')
        : artists;
      const title = artistName != null
        ? `${name} - ${artistName}`
        : name;
      root.$dispatch('playlists/createPlaylist', {
        name: title,
        description: '',
        uriList: props.uriList,
      }).then(() => {
        root.$toast.pushPrimary(`"${title}" を新規プレイリストに追加しました。`);
      }).catch((err: Error) => {
        console.error({ err });
        root.$toast.pushError(`"${title}" を新規プレイリストに追加できませんでした。`);
      });
    };
    const onItemClicked = (playlist: SpotifyAPI.SimplePlaylist) => {
      root.$dispatch('playlists/addItemToPlaylist', {
        playlistId: playlist.id,
        playlistName: playlist.name,
        name: props.name,
        uriList: props.uriList,
      });
    };

    return {
      ownPlaylists,
      onNewPlaylistClicked,
      onItemClicked,
    };
  },
});
</script>
