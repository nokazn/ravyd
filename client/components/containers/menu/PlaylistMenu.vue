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

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean
}

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
        const isCollaborative = !this.playlist.isCollaborative;
        const name = isCollaborative
          ? 'コラボプレイリストにする'
          : 'コラボプレイリストにしない';

        return {
          name,
          handler: () => {
            this.$dispatch('playlists/editPlaylist', {
              playlistId: this.playlist.id,
              isCollaborative,
            }).then(() => {
              this.$toast.show('primary', isCollaborative
                ? 'コラボプレイリストにしました。'
                : 'コラボプレイリストを解除しました。');
            }).catch((err: Error) => {
              console.error({ err });
              this.$toast.show('error', isCollaborative
                ? 'コラボプレイリストにできませんでした。'
                : 'コラボプレイリストを解除できませんでした。');
            });
          },
        };
      };

      const toggleIsPublic = () => {
        const isPublic = !this.playlist.isPublic;
        const name = isPublic
          ? '公開する'
          : '非公開にする';

        return {
          name,
          handler: () => {
            this.$dispatch('playlists/editPlaylist', {
              playlistId: this.playlist.id,
              isPublic: !this.playlist.isPublic,
            }).then(() => {
              this.$toast.show('primary', isPublic
                ? 'プレイリストを公開しました。'
                : 'プレイリストを非公開にしました。');
            }).catch((err: Error) => {
              console.error({ err });
              this.$toast.show('error', isPublic
                ? 'プレイリストの公開に失敗しました。'
                : 'プレイリストを非公開にできませんでした。');
            });
          },
          disabled: this.playlist.isCollaborative,
        };
      };

      const followPlaylist = () => {
        const isOwnPlaylist = this.playlist.owner.id === this.$getters()['auth/userId'];
        const handler = () => {
          const nextFollowingState = !this.playlist.isFollowing;
          this.$emit(ON_FOLLOW_MENU_CLICKED, nextFollowingState);
        };

        return this.playlist.isFollowing
          ? {
            name: isOwnPlaylist ? '削除する' : 'フォローしない',
            handler,
          }
          : {
            name: 'フォローする',
            handler,
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

      // 自分のプレイリストの場合は編集するメニューを表示
      return this.playlist.isOwnPlaylist
        ? [
          [toggleIsCollaborative(), toggleIsPublic()],
          [followPlaylist()],
          [share()],
        ]
        : [
          [followPlaylist()],
          [share()],
        ];
    },
  },
});
</script>
