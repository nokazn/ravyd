<template>
  <ContextMenu
    :groups="menuGroups"
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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import {
  useAddItemToQueueMenu,
  useRemovePlaylistItemMenu,
  useAddItemToPlaylistMenu,
  useShareMenu,
} from '~/use/menu';
import type { App } from '~~/types';

export default defineComponent({
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

  setup(props, { root }) {
    const addItemToQueue = useAddItemToQueueMenu(root, props.episode);
    const removePlaylistItem = useRemovePlaylistItemMenu(root, props.episode, props.playlistId);
    const addItemToPlaylist = useAddItemToPlaylistMenu(props.episode, {
      publisher: props.publisher,
      left: props.left,
      right: props.right,
    });
    const share = useShareMenu({
      name: props.episode.name,
      uri: props.episode.uri,
      typeName: 'エピソード',
      artists: props.publisher,
      externalUrls: props.episode.externalUrls,
      left: props.left,
      right: props.right,
    });

    const menuGroups = computed<App.MenuItemGroup[]>(() => {
      // 自分のプレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return props.playlistId != null
        ? [
          [addItemToQueue],
          [addItemToPlaylist, removePlaylistItem],
          [share],
        ]
        : [
          [addItemToQueue],
          [addItemToPlaylist],
          [share],
        ];
    });

    return { menuGroups };
  },
});
</script>
