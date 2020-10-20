<template>
  <ContextMenu
    top
    left
    offset-x
    offset-y
    :groups="menuItemLists"
    :loading="isLoading"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { RootGetters } from 'typed-vuex';

import ContextMenu, { Group, MenuItem } from '~/components/parts/menu/ContextMenu.vue';
import ArtistLinkMenu, { Props as ArtistLinkMenuProps } from '~/components/parts/menu/ArtistLinkMenu.vue';
import AddItemToPlaylistMenu, { Props as AddItemToPlaylistMenuProps } from '~/components/containers/menu/AddItemToPlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';

const ON_FAVORITE_MENU_CLICKED = 'on-favorite-menu-clicked';

export type On = {
  [ON_FAVORITE_MENU_CLICKED]: 'on-favorite-menu-clicked';
}

type Data = {
  isLoading: boolean
}

export default Vue.extend({
  components: {
    ContextMenu,
  },

  data(): Data {
    return {
      isLoading: false,
    };
  },

  computed: {
    track(): RootGetters['playback/currentTrack'] {
      return this.$getters()['playback/currentTrack'];
    },
    addItemToQueue(): MenuItem<'custom'> {
      const type = 'custom';
      const name = '次に再生に追加';
      const trackName = this.track?.name;
      const uri = this.track?.uri;
      if (trackName == null || uri == null) {
        return {
          type,
          name,
          handler: () => {},
          disabled: true,
        };
      }
      return {
        type,
        name,
        handler: () => {
          this.$spotify.player.addItemToQueue({ uri })
            .then(() => {
              this.$toast.pushPrimary(`"${trackName}" を次に再生に追加しました。`);
            })
            .catch((err: Error) => {
              console.error({ err });
              this.$toast.pushError(`"${trackName}" を次に再生に追加できませんでした。`);
            });
        },
      };
    },
    artistPage(): MenuItem {
      const name = 'アーティストページに移動';
      const artists = this.track?.artists;
      if (artists == null || artists.length === 0) {
        return {
          type: 'custom',
          name,
          handler: () => {},
          disabled: true,
        };
      }
      //  アーティストが複数の時
      if (artists.length > 1) {
        const props: ArtistLinkMenuProps = {
          artists,
          left: true,
        };
        return {
          type: 'component',
          component: ArtistLinkMenu,
          props,
        };
      }
      // アーティストが一組の時
      const artistId = artists[0].id;
      return {
        type: 'to',
        name,
        to: `/artists/${artistId}`,
        disabled: this.$route.params.artistId === artistId,
      };
    },
    releasePage(): MenuItem<'custom' | 'to'> {
      const name = 'アルバムページに移動';
      const releaseId = this.track?.releaseId;
      if (releaseId == null) {
        return {
          type: 'custom',
          name,
          handler: () => {},
          disabled: true,
        };
      }
      return {
        type: 'to',
        name,
        to: `/releases/${releaseId}`,
        disabled: this.$route.params.releaseId === releaseId,
      };
    },
    saveTrack(): MenuItem<'custom'> {
      const isSaved = this.track?.isSaved;
      if (isSaved == null) {
        return {
          type: 'custom',
          name: 'お気に入りに追加',
          handler: () => {},
          disabled: true,
        };
      }
      return {
        type: 'custom',
        name: isSaved ? 'お気に入りから削除' : 'お気に入りに追加',
        handler: () => {
          const nextSavedState = !isSaved;
          this.$emit(ON_FAVORITE_MENU_CLICKED, nextSavedState);
        },
      };
    },
    addItemToPlaylist(): MenuItem<'custom' | 'component'> {
      const { track } = this;
      if (track == null) {
        return {
          type: 'custom',
          name: 'プレイリストに追加',
          handler: () => {},
          disabled: true,
        };
      }
      const props: AddItemToPlaylistMenuProps = {
        name: track.name,
        uriList: [track.uri],
        artists: track.artists,
        left: true,
      };
      return {
        type: 'component',
        component: AddItemToPlaylistMenu,
        props,
      };
    },
    share(): MenuItem<'custom' | 'component'> {
      const { track } = this;
      if (track == null) {
        return {
          type: 'custom',
          name: 'シェア',
          handler: () => {},
          disabled: true,
        };
      }
      const props: ShareMenuProps = {
        name: track.name,
        uri: track.uri,
        url: `/releases/${track.releaseId}`,
        typeName: '曲',
        artists: track.artists,
        externalUrls: track.externalUrls,
        left: true,
      };
      return {
        type: 'component',
        component: ShareMenu,
        props,
      };
    },
    updatePlayback(): MenuItem<'custom'> {
      return {
        type: 'custom',
        name: 'プレイヤーの情報を更新',
        handler: () => {
          this.isLoading = true;
          Promise.all([
            this.$dispatch('playback/getCurrentPlayback'),
            this.$dispatch('playback/getDeviceList'),
          ]).then(() => {
            this.isLoading = false;
          });
        },
      };
    },
    menuItemLists(): Group[] {
      return [
        [this.addItemToQueue],
        [this.artistPage, this.releasePage],
        [this.saveTrack, this.addItemToPlaylist],
        [this.share],
        [this.updatePlayback],
      ];
    },
  },
});
</script>
