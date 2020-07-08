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
import { App } from '~~/types';

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

  computed: {
    menuItemLists(): MenuItem[][] {
      const artistPage = () => {
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

      const saveRelease = () => {
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

      const share = () => {
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
        [artistPage()],
        [saveRelease(), addItemToPlaylist()],
        [share()],
      ];
    },
  },
});
</script>
