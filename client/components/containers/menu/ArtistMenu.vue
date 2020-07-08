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
    artist: {
      type: Object as PropType<App.ArtistInfo>,
      required: true,
    },
    isFollowing: {
      type: Boolean,
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
      const saveTrackItem = () => {
        const params = [this.artist.id];

        return this.isFollowing
          ? {
            name: 'フォローしない',
            handler: () => {
              this.$dispatch('library/artists/unfollowArtists', params);
            },
          }
          : {
            name: 'フォローする',
            handler: () => {
              this.$dispatch('library/artists/followArtists', params);
            },
          };
      };

      const shareItem = () => {
        const props: ShareMenuProps = {
          name: this.artist.name,
          uri: this.artist.uri,
          typeName: 'アーティスト',
          externalUrls: this.artist.externalUrls,
        };
        return {
          component: ShareMenu,
          props,
        };
      };

      return [
        [saveTrackItem()],
        [shareItem()],
      ];
    },
  },
});
</script>
