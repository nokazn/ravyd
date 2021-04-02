<template>
  <ContextMenu
    :groups="menuGeoups"
    :size="size"
    :outlined="outlined"
    :offset-x="offsetX"
    :offset-y="offsetY"
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

import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import {
  useAddItemToPlaylistMenu,
  useAddItemToQueueMenu,
  useRemovePlaylistItemMenu,
  useArtistLinkMenu,
  useReleaseLinkMenu,
  useShareMenu,
} from '~/use/menu';
import type { App } from '~/entities';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: 'on-favorite-menu-clicked';
};

export default defineComponent({
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

  setup(props, { root, emit }) {
    const addItemToQueue = useAddItemToQueueMenu(root, props.track);
    const addItemToPlaylist = useAddItemToPlaylistMenu(props.track, {
      publisher: undefined,
      left: props.left,
      right: props.right,
    });
    const removePlaylistItem = useRemovePlaylistItemMenu(root, props.track, props.playlistId);
    const artistPage = useArtistLinkMenu(root, props.track, {
      left: true,
      right: false,
    });
    const releasePage = useReleaseLinkMenu(root, props.track);

    const saveTrack = computed<App.MenuItem<'custom'>>(() => ({
      type: 'custom',
      name: props.track.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
      handler: () => {
        emit(ON_FAVORITE_MENU_CLICKED, !props.track.isSaved);
      },
    }));

    const share = useShareMenu({
      name: props.track.name,
      uri: props.track.uri,
      typeName: '曲',
      artists: props.track.artists,
      externalUrls: props.track.externalUrls,
      left: true,
      right: false,
    });

    const menuGeoups = computed<App.MenuItemGroup[]>(() => {
      // 自分のプレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return props.playlistId != null
        ? [
          [unref(addItemToQueue)],
          [unref(artistPage), unref(releasePage)],
          [unref(saveTrack), unref(addItemToPlaylist), unref(removePlaylistItem)],
          [unref(share)],
        ]
        : [
          [unref(addItemToQueue)],
          [unref(artistPage), unref(releasePage)],
          [unref(saveTrack), unref(addItemToPlaylist)],
          [unref(share)],
        ];
    });

    return { menuGeoups };
  },
});
</script>
