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
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { App } from '~~/types';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: boolean
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
      const artistPage = () => {
        const { artistList } = this.release;
        //  アーティストが複数の時
        if (artistList.length > 1) {
          const props: ArtistLinkMenuProps = {
            artistList,
            left: this.left,
            right: this.right,
          };
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

      const saveRelease = () => ({
        name: this.release.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
        handler: () => {
          const nextSavedState = !this.release.isSaved;
          this.$emit(ON_FAVORITE_MENU_CLICKED, nextSavedState);
        },
      });

      const addItemToPlaylist = () => {
        const uriList = this.release.trackList.map((track) => track.uri);
        const props: AddItemToPlaylistMenuProps = {
          name: this.release.name,
          uriList,
          artists: this.release.artistList,
          left: this.left,
          right: this.right,
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
          artists: this.release.artistList,
          externalUrls: this.release.externalUrls,
          left: this.left,
          right: this.right,
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
