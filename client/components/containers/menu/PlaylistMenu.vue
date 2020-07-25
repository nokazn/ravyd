<template>
  <ContextMenu
    :item-lists="menuItemLists"
    :size="size"
    :outlined="outlined"
    offset-y
    bottom
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ContextMenu, { MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { generateCopiedName } from '~~/utils/generateCopiedName';
import { App } from '~~/types';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';
const ON_EDIT_MENU_CLICKED = 'on-edit-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean
  [ON_EDIT_MENU_CLICKED]: boolean
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
    isFollowing: {
      type: Boolean,
      required: true,
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

      const editPlaylist = () => ({
        name: '詳細の編集',
        handler: () => {
          this.$emit(ON_EDIT_MENU_CLICKED, true);
        },
      });

      const followPlaylist = () => {
        const isOwnPlaylist = this.playlist.owner.id === this.$getters()['auth/userId'];
        const handler = () => {
          const nextFollowingState = !this.isFollowing;
          this.$emit(ON_FOLLOW_MENU_CLICKED, nextFollowingState);
        };

        return this.isFollowing
          ? {
            name: isOwnPlaylist ? '削除する' : 'フォローしない',
            handler,
          }
          : {
            name: 'フォローする',
            handler,
          };
      };

      const copyPlaylist = () => {
        const handler = () => {
          const name = generateCopiedName(this.playlist.name);
          this.$dispatch('playlists/createPlaylist', {
            name,
            uriList: this.playlist.trackUriList,
          }).then(() => {
            this.$toast.show('primary', `"${name}" を作成しました。`);
          }).catch((err: Error) => {
            console.error({ err });
            this.$toast.show('error', err.message);
          });
        };

        return {
          name: '同様のプレイリストを作成',
          handler,
        };
      };

      const share = () => {
        const props: ShareMenuProps = {
          name: this.playlist.name,
          uri: this.playlist.uri,
          typeName: 'プレイリスト',
          artists: undefined,
          externalUrls: this.playlist.externalUrls,
          left: this.left,
          right: this.right,
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
          [editPlaylist(), followPlaylist()],
          [copyPlaylist()],
          [share()],
        ]
        : [
          [followPlaylist()],
          [copyPlaylist()],
          [share()],
        ];
    },
  },
});
</script>
