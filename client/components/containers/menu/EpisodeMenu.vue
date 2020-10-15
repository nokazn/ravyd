<template>
  <ContextMenu
    :groups="menuItemLists"
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

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
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
    addItemToQueue(): MenuItem {
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
    },
    addItemToPlaylist(): MenuItem {
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
    },
    removePlaylistItem(): MenuItem {
      const { playlistId } = this;
      return {
        name: 'このプレイリストから削除',
        handler: () => {
          if (playlistId == null) return;
          const { name, uri, index } = this.episode;
          this.$confirm.open({
            color: 'error',
            text: '削除',
            description: `"${name}" をプレイリストから削除しますか？`,
            onConfirm: async () => {
              await this.$dispatch('playlists/removePlaylistItem', {
                playlistId,
                track: { uri, positions: [index] },
                name,
              });
            },
          });
        },
        disabled: playlistId == null,
      };
    },
    share(): MenuItem {
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
    },
    menuItemLists(): Group[] {
      // 自分のプレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return this.playlistId != null
        ? [
          [this.addItemToQueue],
          [this.addItemToPlaylist, this.removePlaylistItem],
          [this.share],
        ]
        : [
          [this.addItemToQueue],
          [this.addItemToPlaylist],
          [this.share],
        ];
    },
  },
});
</script>
