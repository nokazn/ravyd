<template>
  <ContextMenu
    bottom
    offset-y
    :groups="menuGroups"
    :size="size"
    :fab="fab"
    :outlined="outlined"
    :left="left"
    :right="right"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  unref,
  PropType,
} from '@vue/composition-api';

import { generateCopiedName } from 'shared/utils';
import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import { useShareMenu } from '~/use/menu';
import type { App } from '~/entities';

const ON_FOLLOW_MENU_CLICKED = 'on-follow-menu-clicked';
const ON_EDIT_MENU_CLICKED = 'on-edit-menu-clicked';

export type On = {
  [ON_FOLLOW_MENU_CLICKED]: boolean
  [ON_EDIT_MENU_CLICKED]: boolean
}

export default defineComponent({
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

  setup(props, { root, emit }) {
    const toggleIsCollaborative = computed<App.MenuItem<'custom'>>(() => {
      const isCollaborative = !props.playlist.isCollaborative;
      const name = isCollaborative
        ? 'コラボプレイリストにする'
        : 'コラボプレイリストにしない';
      return {
        type: 'custom',
        name,
        handler: () => {
          root.$dispatch('playlists/editPlaylist', {
            playlistId: props.playlist.id,
            isCollaborative,
          }).then(() => {
            root.$toast.pushPrimary(isCollaborative
              ? 'コラボプレイリストにしました。'
              : 'コラボプレイリストを解除しました。');
          }).catch((err: Error) => {
            console.error({ err });
            root.$toast.pushError(isCollaborative
              ? 'コラボプレイリストにできませんでした。'
              : 'コラボプレイリストを解除できませんでした。');
          });
        },
      };
    });

    const toggleIsPublic = computed<App.MenuItem<'custom'>>(() => {
      const isPublic = !props.playlist.isPublic;
      const name = isPublic
        ? '公開する'
        : '非公開にする';
      return {
        type: 'custom',
        name,
        handler: () => {
          root.$dispatch('playlists/editPlaylist', {
            playlistId: props.playlist.id,
            isPublic,
          }).then(() => {
            root.$toast.pushPrimary(isPublic
              ? 'プレイリストを公開しました。'
              : 'プレイリストを非公開にしました。');
          }).catch((err: Error) => {
            console.error({ err });
            root.$toast.pushError(isPublic
              ? 'プレイリストの公開に失敗しました。'
              : 'プレイリストを非公開にできませんでした。');
          });
        },
        disabled: props.playlist.isCollaborative,
      };
    });

    const editPlaylist = computed<App.MenuItem<'custom'>>(() => ({
      type: 'custom',
      name: '詳細の編集',
      handler: () => {
        emit(ON_EDIT_MENU_CLICKED, true);
      },
      // 自分のプレイリストで削除済の場合
      disabled: props.playlist.isOwnPlaylist && !props.following,
    }));

    const followPlaylist = computed<App.MenuItem<'custom'>>(() => {
      const type = 'custom';
      const isOwnPlaylist = props.playlist.owner.id === root.$getters()['auth/userId'];
      const handler = () => {
        emit(ON_FOLLOW_MENU_CLICKED, !props.following);
      };
      return props.following
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
    });

    const copyPlaylist: App.MenuItem<'custom'> = {
      type: 'custom',
      name: '同様のプレイリストを作成',
      handler: () => {
        const name = generateCopiedName(props.playlist.name);
        root.$dispatch('playlists/createPlaylist', {
          name,
          uriList: props.playlist.trackUriList,
        }).then(() => {
          root.$toast.pushPrimary(`"${name}" を作成しました。`);
        }).catch((err: Error) => {
          console.error({ err });
          root.$toast.pushError(err.message);
        });
      },
    };

    const share = useShareMenu({
      name: props.playlist.name,
      uri: props.playlist.uri,
      typeName: 'プレイリスト',
      artists: undefined,
      externalUrls: props.playlist.externalUrls,
      left: props.left,
      right: props.right,
    });

    const menuGroups = computed<App.MenuItemGroup[]>(() => {
      // 自分のプレイリストの場合は編集するメニューを表示
      return props.playlist.isOwnPlaylist
        ? [
          [unref(toggleIsCollaborative), unref(toggleIsPublic)],
          [unref(editPlaylist), unref(followPlaylist)],
          [unref(copyPlaylist)],
          [unref(share)],
        ]
        : [
          [unref(followPlaylist)],
          [unref(copyPlaylist)],
          [unref(share)],
        ];
    });

    return {
      menuGroups,
    };
  },
});
</script>
