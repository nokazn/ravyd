<template>
  <ContextMenu
    :groups="menuItemLists"
    :size="size"
    :outlined="outlined"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';

import type { ToastType } from '~/plugins/observable/toast';
import type { App } from '~~/types';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

type Modal = {
  value: boolean;
  loading: boolean;
  type: string;
  color: ToastType | undefined;
  text: string;
  description: string;
}

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: 'on-favorite-menu-clicked';
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    track: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
    playlistId: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    size: {
      type: Number,
      default: 36,
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    right: {
      type: Boolean,
      default: false,
    },
    offsetX: {
      type: Boolean,
      default: false,
    },
    offsetY: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    addItemToQueue(): MenuItem {
      const trackName = this.track.name;
      return {
        name: '次に再生に追加',
        handler: () => {
          this.$spotify.player.addItemToQueue({
            uri: this.track.uri,
          }).then(() => {
            this.$toast.push({
              color: 'primary',
              message: `"${trackName}" を次に再生に追加しました。`,
            });
          }).catch((err: Error) => {
            console.error({ err });
            this.$toast.push({
              color: 'error',
              message: `"${trackName}" を次に再生に追加できませんでした。`,
            });
          });
        },
      };
    },
    artistPage(): MenuItem {
      const artists = [...this.track.artists, ...this.track.featuredArtists];
      const { length } = artists;
      const name = 'アーティストページに移動';
      if (length === 0) {
        return {
          name,
          handler: () => {},
          disabled: true,
        };
      }
      //  アーティストが複数の時
      if (artists.length > 1) {
        const props: ArtistLinkMenuProps = {
          artists,
          left: true,
        };
        return {
          component: ArtistLinkMenu,
          props,
        };
      }
      // アーティストが一組の時
      const artistId = artists[0].id;
      return {
        name,
        to: `/artists/${artistId}`,
        disabled: this.$route.params.artistId === artistId,
      };
    },
    releasePage(): MenuItem {
      const { releaseId } = this.track;
      return {
        name: 'アルバムページに移動',
        to: `/releases/${releaseId}`,
        disabled: this.$route.params.releaseId === releaseId,
      };
    },
    saveTrack(): MenuItem {
      return {
        name: this.track.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
        handler: () => {
          const nextSavedState = !this.track.isSaved;
          this.$emit(ON_FAVORITE_MENU_CLICKED, nextSavedState);
        },
      };
    },
    addItemToPlaylist(): MenuItem {
      const props: AddItemToPlaylistMenuProps = {
        name: this.track.name,
        uriList: [this.track.uri],
        artists: this.track.artists,
        left: true,
      };
      return {
        component: AddItemToPlaylistMenu,
        props,
      };
    },
    removePlaylistItem(): MenuItem {
      const { playlistId } = this;
      return {
        name: 'このプレイリストから削除',
        handler: () => {
          if (playlistId == null) return;
          const { name, uri, index } = this.track;
          this.$confirm.open({
            color: 'error',
            text: '削除',
            description: `"${name}" をプレイリストから削除しますか？`,
            onConfirm: async () => {
              if (playlistId == null) return;
              await this.$dispatch('playlists/removePlaylistItem', {
                playlistId,
                track: {
                  uri,
                  positions: [index],
                },
                name,
              });
            },
          });
        },
        disabled: playlistId == null,
      };
    },
    share() {
      const props: ShareMenuProps = {
        name: this.track.name,
        uri: this.track.uri,
        typeName: '曲',
        artists: this.track.artists,
        externalUrls: this.track.externalUrls,
        left: true,
      };
      return {
        component: ShareMenu,
        props,
      };
    },
    menuItemLists(): Group[] {
      // 自分のプレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return this.playlistId != null
        ? [
          [this.addItemToQueue],
          [this.artistPage, this.releasePage],
          [this.saveTrack, this.addItemToPlaylist, this.removePlaylistItem],
          [this.share],
        ]
        : [
          [this.addItemToQueue],
          [this.artistPage, this.releasePage],
          [this.saveTrack, this.addItemToPlaylist],
          [this.share],
        ];
    },
  },
});
</script>
