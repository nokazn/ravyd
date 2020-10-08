<template>
  <ContextMenu
    :item-lists="menuItemLists"
    :size="size"
    :fab="fab"
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
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    episode: {
      type: Object as PropType<App.EpisodeDetail>,
      required: true,
    },
    publisher: {
      type: String,
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
    fab: {
      type: Boolean,
      default: false,
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
        const trackName = this.episode.name;
        return {
          name: '次に再生に追加',
          handler: () => {
            this.$spotify.player.addItemToQueue({
              uri: this.episode.uri,
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
      };

      const addItemToPlaylist = () => {
        const props: AddItemToPlaylistMenuProps = {
          name: this.episode.name,
          uriList: [this.episode.uri],
          artists: this.publisher,
          left: this.left,
          right: this.right,
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
              uri: this.episode.uri,
              positions: [this.episode.index],
            },
            name: this.episode.name,
          });
        },
        disabled: this.playlistId == null,
      });

      const share = () => {
        const props: ShareMenuProps = {
          name: this.episode.name,
          uri: this.episode.uri,
          typeName: 'エピソード',
          artists: this.publisher,
          externalUrls: this.episode.externalUrls,
          left: this.left,
          right: this.right,
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
          [addItemToPlaylist(), removePlaylistItem()],
          [share()],
        ]
        : [
          [addItemToQueue()],
          [addItemToPlaylist()],
          [share()],
        ];
    },
  },
});
</script>
