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
import { App } from '~~/types';

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

  computed: {
    menuItemLists(): MenuItem[][] {
      const saveTrack = () => {
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

      const share = () => {
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
        [saveTrack()],
        [share()],
      ];
    },
  },
});
</script>
