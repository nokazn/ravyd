<template>
  <ContextMenu
    :item-lists="menuItemLists"
    outlined
    offset-y
    bottom
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContextMenu, { MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    playlist: {
      type: Object as PropType<App.PlaylistInfo>,
      required: true,
    },
  },

  computed: {
    menuItemLists(): MenuItem[][] {
      const toggleIsCollaborative = () => {
        const name = this.playlist.isCollaborative
          ? 'コラボプレイリストにしない'
          : 'コラボプレイリストにする';

        return {
          name,
          handler: () => {
            this.$dispatch('playlists/editPlaylist', {
              playlistId: this.playlist.id,
              isCollaborative: !this.playlist.isCollaborative,
            });
          },
        };
      };

      const toggleIsPublic = () => {
        const name = this.playlist.isPublic
          ? '非公開にする'
          : '公開する';

        return {
          name,
          handler: () => {
            this.$dispatch('playlists/editPlaylist', {
              playlistId: this.playlist.id,
              isPublic: !this.playlist.isPublic,
            });
          },
        };
      };

      const followPlaylist = () => {
        const isOwnPlaylist = this.playlist.owner.id === this.$getters()['auth/userId'];
        return this.playlist.isFollowing
          ? {
            name: isOwnPlaylist ? '削除する' : 'フォローしない',
            handler: () => {
              this.$dispatch('playlists/unfollowPlaylist', this.playlist.id);
            },
          }
          : {
            name: 'フォローする',
            handler: () => {
              this.$dispatch('playlists/followPlaylist', this.playlist.id);
            },
          };
      };

      const share = () => {
        const props: ShareMenuProps = {
          name: this.playlist.name,
          uri: this.playlist.uri,
          typeName: '曲',
          externalUrls: this.playlist.externalUrls,
        };
        return {
          component: ShareMenu,
          props,
        };
      };

      // プレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return [
        [toggleIsCollaborative(), toggleIsPublic()],
        [followPlaylist()],
        [share()],
      ];
    },
  },
});
</script>
