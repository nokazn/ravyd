<template>
  <ContextMenu
    :item-lists="menuItemLists"
    offset-x
    left
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
  [ON_FAVORITE_MENU_CLICKED]: 'on-favorite-menu-clicked';
}

export default Vue.extend({
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
  },

  computed: {
    menuItemLists(): MenuItem[][] {
      const addItemToQueue = () => {
        const trackName = this.track.name;
        return {
          name: '次に再生に追加',
          handler: () => {
            this.$spotify.player.addItemToQueue({
              uri: this.track.uri,
            }).then(() => {
              this.$toast.show(undefined, `"${trackName}" を次に再生に追加しました。`);
            }).catch((err: Error) => {
              console.error({ err });
              this.$toast.show('error', `"${trackName}" を次に再生に追加できませんでした。`);
            });
          },
        };
      };

      const artistPage = () => {
        const artistList = [...this.track.artistList, ...this.track.featuredArtistList];
        if (artistList.length > 1) {
          const props: ArtistLinkMenuProps = {
            artistList,
            left: true,
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

      const releasePage = () => {
        const { releaseId } = this.track;

        return {
          name: 'アルバムページに移動',
          to: `/releases/${releaseId}`,
          disabled: this.$route.params.releaseId === releaseId,
        };
      };

      const saveTrack = () => ({
        name: this.track.isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
        handler: () => {
          const nextSavedState = !this.track.isSaved;
          this.$emit(ON_FAVORITE_MENU_CLICKED, nextSavedState);
        },
      });

      const addItemToPlaylist = () => {
        const props: AddItemToPlaylistMenuProps = {
          name: this.track.name,
          uriList: [this.track.uri],
          artistList: this.track.artistList,
          left: true,
        };

        return {
          component: AddItemToPlaylistMenu,
          props,
        };
      };

      const removePlaylistItem = () => ({
        name: 'このプレイリストから削除',
        handler: async () => {
          if (this.playlistId == null) return;

          const { snapshot_id } = await this.$spotify.playlists.removePlaylistItems({
            playlistId: this.playlistId,
            tracks: [{
              uri: this.track.uri,
              positions: [this.track.index],
            }],
          });

          if (snapshot_id != null) {
            this.$toast.show('primary', `${this.track.name}をこのプレイリストから削除しました。`);
          } else {
            this.$toast.show('primary', `${this.track.name}をこのプレイリストから削除できませんでした。`);
          }
        },
        disabled: this.playlistId == null,
      });

      const share = () => {
        const props: ShareMenuProps = {
          name: this.track.name,
          uri: this.track.uri,
          typeName: '曲',
          artistList: this.track.artistList,
          externalUrls: this.track.externalUrls,
          left: true,
        };
        return {
          component: ShareMenu,
          props,
        };
      };

      // プレイリスト内のトラックの場合は「プレイリストから削除」のメニューを表示
      return this.playlistId != null
        ? [
          [addItemToQueue()],
          [artistPage(), releasePage()],
          [saveTrack(), addItemToPlaylist(), removePlaylistItem()],
          [share()],
        ]
        : [
          [addItemToQueue()],
          [artistPage(), releasePage()],
          [saveTrack(), addItemToPlaylist()],
          [share()],
        ];
    },
  },
});
</script>
