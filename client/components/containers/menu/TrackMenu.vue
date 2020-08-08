<template>
  <ContextMenu
    :item-lists="menuItemLists"
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

import ContextMenu, { MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

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
    menuItemLists(): MenuItem[][] {
      const addItemToQueue = () => {
        const trackName = this.track.name;
        return {
          name: '次に再生に追加',
          handler: () => {
            this.$spotify.player.addItemToQueue({
              uri: this.track.uri,
            }).then(() => {
              this.$toast.show('primary', `"${trackName}" を次に再生に追加しました。`);
            }).catch((err: Error) => {
              console.error({ err });
              this.$toast.show('error', `"${trackName}" を次に再生に追加できませんでした。`);
            });
          },
        };
      };

      const artistPage = () => {
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

        const artistId = artists[0].id;
        return {
          name,
          to: `/artists/${artistId}`,
          disabled: this.$route.params.artistId === artistId,
        };
      };

      const releasePage = () => {
        const { releaseId } = this.track;

        return {
          name: 'アルバムページに移動',
          to: `/releases/${releaseId}`,
          disabled: this.$route.params.releaseId === releaseId,
        };
      };

      const saveTrack = () => ({
        name: this.track.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
        handler: () => {
          const nextSavedState = !this.track.isSaved;
          this.$emit(ON_FAVORITE_MENU_CLICKED, nextSavedState);
        },
      });

      const addItemToPlaylist = () => {
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
      };

      const removePlaylistItem = () => ({
        name: 'このプレイリストから削除',
        handler: () => {
          if (this.playlistId == null) return;

          this.$dispatch('playlists/removePlaylistItem', {
            playlistId: this.playlistId,
            track: {
              uri: this.track.uri,
              positions: [this.track.index],
            },
            name: this.track.name,
          });
        },
        disabled: this.playlistId == null,
      });

      const share = () => {
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
      };

      // 自分のプレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return this.playlistId != null
        ? [
          [addItemToQueue()],
          [artistPage(), releasePage()],
          [saveTrack(), addItemToPlaylist(), removePlaylistItem()],
          [share()],
        ]
        : [
          [addItemToQueue()],
          [artistPage(), releasePage()],
          [saveTrack(), addItemToPlaylist()],
          [share()],
        ];
    },
  },
});
</script>
