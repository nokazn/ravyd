<template>
  <ContextMenu
    top
    left
    offset-x
    offset-y
    :groups="menuGroups"
    :loading="isLoading"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  unref,
  computed,
} from '@vue/composition-api';

import ContextMenu from '~/components/parts/menu/ContextMenu.vue';
import {
  useAddItemToPlaylistMenu,
  useAddItemToQueueMenu,
  useArtistLinkMenu,
  useReleaseLinkMenu,
  useShareMenu,
  useTrackLinkMenu,
} from '~/use/menu';
import type { App } from '~/entities';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
};

const emptyMenuItem = (name: string) : App.MenuItem<'custom'> => ({
  type: 'custom',
  name,
  handler: () => {},
  disabled: true,
});

export default defineComponent({
  components: {
    ContextMenu,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { root, emit }) {
    const isLoading = ref(false);
    const track = computed(() => root.$getters()['playback/currentTrack']);

    const addItemToQueue = computed(() => useAddItemToQueueMenu(root, unref(track)));
    const artistPage = computed(() => useArtistLinkMenu(root, unref(track), {
      left: true,
      right: false,
    }));
    const trackPage = computed(() => useTrackLinkMenu(root, unref(track)));
    const releasePage = computed(() => useReleaseLinkMenu(root, unref(track)));
    const addItemToPlaylist = computed(() => useAddItemToPlaylistMenu(unref(track), {
      publisher: undefined,
      left: true,
      right: false,
    }));
    const share = computed(() => {
      const item = unref(track);
      return useShareMenu(item != null
        ? {
          name: item.name,
          uri: item.uri,
          url: `/releases/${item.releaseId}`,
          typeName: '曲',
          artists: item.artists,
          externalUrls: item.externalUrls,
          left: true,
          right: false,
        }
        : undefined);
    });

    const saveTrack = computed<App.MenuItem<'custom'>>(() => {
      const item = unref(track);
      return item != null
        ? {
          type: 'custom',
          name: props.value ? 'お気に入りから削除' : 'お気に入りに追加',
          handler: () => {
            emit(INPUT, !props.value);
          },
          disabled: item.type !== 'track',
        }
        : emptyMenuItem('お気に入りに追加');
    });

    const updatePlayback = computed<App.MenuItem<'custom'>>(() => {
      return {
        type: 'custom',
        name: 'プレイヤーの情報を更新',
        handler: () => {
          isLoading.value = true;
          Promise.all([
            root.$dispatch('playback/getCurrentPlayback'),
            root.$dispatch('playback/getDeviceList'),
          ]).then(() => {
            isLoading.value = false;
          });
        },
      };
    });

    const menuGroups = computed<App.MenuItemGroup[]>(() => {
      const isEpisode = track.value?.type === 'episode';
      return [
        [unref(addItemToQueue)],
        [isEpisode ? unref(trackPage) : unref(artistPage), unref(releasePage)],
        [unref(saveTrack), unref(addItemToPlaylist)],
        [unref(share)],
        [unref(updatePlayback)],
      ];
    });

    return {
      isLoading,
      menuGroups,
    };
  },
});
</script>
