<template>
  <v-menu
    offset-x
    left
    :z-index="Z_INDEX"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        size="small"
        :disabled="!track.isPlayable"
        title="メニュー"
        v-on="on"
      >
        <v-icon>
          mdi-dots-horizontal
        </v-icon>
      </v-btn>
    </template>

    <v-list
      dense
      :color="MENU_BACKGROUND_COLOR"
      :elevation="12"
    >
      <template v-for="(group, index) in menuItemLists">
        <v-divider
          v-show="index !== 0"
          :key="`${index}-devider`"
        />

        <v-list-item-group :key="index">
          <template v-for="item in group">
            <component
              :is="item.component"
              v-if="item.component != null"
              :key="item.name"
              v-bind="item.props"
            />

            <v-list-item
              v-else-if="item.to != null"
              :key="item.name"
              nuxt
              :to="item.to"
              :disabled="item.disabled"
              :inactive="item.disabled"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-else
              :key="item.name"
              :disabled="item.disabled"
              :inactive="item.disabled"
              @click="item.handler"
            >
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';

import ArtistMenu, { Props as ArtistMenuProps } from '~/components/parts/menu/ArtistMenu.vue';
import PlaylistMenu, { Props as PlaylistMenuProps } from '~/components/containers/menu/PlaylistMenu.vue';
import ShareMenu, { Props as ShareMenuProps } from '~/components/parts/menu/ShareMenu.vue';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { App } from '~~/types';

type MenuItem = {
  name: string
  disabled?: boolean
  to: string
} | {
  name: string
  disabled?: boolean
  handler: () => void
} | {
  component: VueConstructor
  props: { [k in string]: unknown }
}

type Data = {
  menuItemLists: MenuItem[][]
  MENU_BACKGROUND_COLOR: string
  Z_INDEX: number
}

export default Vue.extend({
  components: {
    ArtistMenu,
    PlaylistMenu,
    ShareMenu,
  },

  props: {
    track: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
  },

  data(): Data {
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

    const artistPageItem = () => {
      const artistList = [...this.track.artistList, ...this.track.featuredArtistList];
      if (artistList.length > 1) {
        const props: ArtistMenuProps = { artistList };
        return {
          component: ArtistMenu,
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

    const releasePageItem = () => {
      const { releaseId } = this.track;

      return {
        name: 'アルバムページに移動',
        to: `/releases/${releaseId}`,
        disabled: this.$route.params.releaseId === releaseId,
      };
    };

    const saveTrackItem = () => {
      const params = [this.track.id];

      return this.track.isSaved
        ? {
          name: 'お気に入りから削除',
          handler: () => {
            this.$dispatch('library/tracks/removeTracks', params);
          },
        }
        : {
          name: 'お気に入りに追加',
          handler: () => {
            this.$dispatch('library/tracks/saveTracks', params);
          },
        };
    };

    const addItemToPlaylist = () => {
      const props: PlaylistMenuProps = {
        name: this.track.name,
        uriList: [this.track.uri],
        artistList: this.track.artistList,
      };

      return {
        component: PlaylistMenu,
        props,
      };
    };

    const shareItem = () => {
      const props: ShareMenuProps = {
        name: this.track.name,
        uri: this.track.uri,
        artistList: this.track.artistList,
        externalUrls: this.track.externalUrls,
      };

      return {
        component: ShareMenu,
        props,
      };
    };

    return {
      menuItemLists: [
        [addItemToQueue()],
        [artistPageItem(), releasePageItem()],
        [saveTrackItem(), addItemToPlaylist()],
        [shareItem()],
      ],
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },
});
</script>
