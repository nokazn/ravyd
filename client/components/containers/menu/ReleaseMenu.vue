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
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { App } from '~~/types';

type Data = {
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  props: {
    release: {
      type: Object as PropType<App.ReleaseInfo>,
      required: true,
    },
  },

  data(): Data {
    return {
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    menuItemLists(): MenuItem[][] {
      const artistPageItem = () => {
        const { artistList } = this.release;
        if (artistList.length > 1) {
          const props: ArtistLinkMenuProps = { artistList };
          return {
            component: ArtistLinkMenu,
            props,
          };
        }

        const artist = artistList[0] as App.SimpleArtistInfo | undefined;
        return {
          name: 'アーティストページに移動',
          to: `/artists/${artist?.id}`,
          disabled: artist == null || this.$route.params.artistId === artist.id,
        };
      };

      const saveReleaseItem = () => {
        const params = [this.release.id];

        return this.release.isSaved
          ? {
            name: 'お気に入りから削除',
            handler: () => {
              this.$dispatch('library/releases/removeReleases', params);
            },
          }
          : {
            name: 'お気に入りに追加',
            handler: () => {
              this.$dispatch('library/releases/saveReleases', params);
            },
          };
      };

      const addItemToPlaylist = () => {
        const uriList = this.release.trackList.map((track) => track.uri);
        const props: AddItemToPlaylistMenuProps = {
          name: this.release.name,
          uriList,
          artistList: this.release.artistList,
        };

        return {
          component: AddItemToPlaylistMenu,
          props,
        };
      };

      const shareItem = () => {
        const props: ShareMenuProps = {
          name: this.release.name,
          uri: this.release.uri,
          typeName: 'アルバム',
          artistList: this.release.artistList,
          externalUrls: this.release.externalUrls,
        };

        return {
          component: ShareMenu,
          props,
        };
      };

      return [
        [artistPageItem()],
        [saveReleaseItem(), addItemToPlaylist()],
        [shareItem()],
      ];
    },
  },
});
</script>
