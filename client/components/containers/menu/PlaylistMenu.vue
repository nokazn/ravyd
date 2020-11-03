<template>
  <ContextMenu
    bottom
    offset-y
    :groups="menuItemLists"
    :size="size"
    :fab="fab"
    :outlined="outlined"
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { generateCopiedName } from '~~/utils/generateCopiedName';
import type { App } from '~~/types';

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
      type: Object as PropType<App.PlaylistPage>,
      required: true,
    },
    following: {
      type: Boolean,
      required: true,
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
  },

  computed: {
    toggleIsCollaborative(): App.MenuItem<'custom'> {
      const isCollaborative = !this.playlist.isCollaborative;
      const name = isCollaborative
        ? 'コラボプレイリストにする'
        : 'コラボプレイリストにしない';
      return {
        type: 'custom',
        name,
        handler: () => {
          this.$dispatch('playlists/editPlaylist', {
            playlistId: this.playlist.id,
            isCollaborative,
          }).then(() => {
            this.$toast.pushPrimary(isCollaborative
              ? 'コラボプレイリストにしました。'
              : 'コラボプレイリストを解除しました。');
          }).catch((err: Error) => {
            console.error({ err });
            this.$toast.pushError(isCollaborative
              ? 'コラボプレイリストにできませんでした。'
              : 'コラボプレイリストを解除できませんでした。');
          });
        },
      };
    },
    toggleIsPublic(): App.MenuItem<'custom'> {
      const isPublic = !this.playlist.isPublic;
      const name = isPublic
        ? '公開する'
        : '非公開にする';
      return {
        type: 'custom',
        name,
        handler: () => {
          this.$dispatch('playlists/editPlaylist', {
            playlistId: this.playlist.id,
            isPublic: !this.playlist.isPublic,
          }).then(() => {
            this.$toast.pushPrimary(isPublic
              ? 'プレイリストを公開しました。'
              : 'プレイリストを非公開にしました。');
          }).catch((err: Error) => {
            console.error({ err });
            this.$toast.pushError(isPublic
              ? 'プレイリストの公開に失敗しました。'
              : 'プレイリストを非公開にできませんでした。');
          });
        },
        disabled: this.playlist.isCollaborative,
      };
    },
    editPlaylist(): App.MenuItem<'custom'> {
      return {
        type: 'custom',
        name: '詳細の編集',
        // 自分のプレイリストで削除済の場合
        disabled: this.playlist.isOwnPlaylist && !this.following,
        handler: () => {
          this.$emit(ON_EDIT_MENU_CLICKED, true);
        },
      };
    },
    followPlaylist(): App.MenuItem<'custom'> {
      const type = 'custom';
      const isOwnPlaylist = this.playlist.owner.id === this.$getters()['auth/userId'];
      const handler = () => {
        const nextFollowingState = !this.following;
        this.$emit(ON_FOLLOW_MENU_CLICKED, nextFollowingState);
      };
      return this.following
        ? {
          type,
          name: isOwnPlaylist ? '削除する' : 'フォローしない',
          handler,
        }
        : {
          type,
          name: 'フォローする',
          handler,
        };
    },
    copyPlaylist(): App.MenuItem<'custom'> {
      const handler = () => {
        const name = generateCopiedName(this.playlist.name);
        this.$dispatch('playlists/createPlaylist', {
          name,
          uriList: this.playlist.trackUriList,
        }).then(() => {
          this.$toast.pushPrimary(`"${name}" を作成しました。`);
        }).catch((err: Error) => {
          console.error({ err });
          this.$toast.pushError(err.message);
        });
      };
      return {
        type: 'custom',
        name: '同様のプレイリストを作成',
        handler,
      };
    },
    share(): App.MenuItem<'component'> {
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
        type: 'component',
        component: ShareMenu,
        props,
      };
    },
    menuItemLists(): App.MenuItemGroup[] {
      // 自分のプレイリストの場合は編集するメニューを表示
      return this.playlist.isOwnPlaylist
        ? [
          [this.toggleIsCollaborative, this.toggleIsPublic],
          [this.editPlaylist, this.followPlaylist],
          [this.copyPlaylist],
          [this.share],
        ]
        : [
          [this.followPlaylist],
          [this.copyPlaylist],
          [this.share],
        ];
    },
  },
});
</script>
