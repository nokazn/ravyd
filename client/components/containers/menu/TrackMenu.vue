<template>
  <v-menu
    offset-x
    left
    :z-index="1001"
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
            <v-list-item
              v-if="item.to != null"
              :key="item.name"
              nuxt
              :to="item.to"
              :disabled="item.disabled"
              :inactive="item.disabled"
            >
              <v-list-item-title
                :class="{ 'inactive--text': item.disabled }"
              >
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
              <v-list-item-title
                :class="{ 'inactive--text': item.disabled }"
              >
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>
      </template>

      <v-divider />

      <v-list-item-group>
        <ShareMenu :track="track" />
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ShareMenu from '~/components/parts/menu/ShareMenu.vue';
import { MENU_BACKGROUND_COLOR } from '~/variables';
import { App } from '~~/types';

type MenuItem = {
  name: string
  disabled?: boolean
  to: string
} | {
  name: string
  disabled?: boolean
  handler: () => void
}

type Data = {
  MENU_BACKGROUND_COLOR: string
}

export default Vue.extend({
  components: {
    ShareMenu,
  },

  props: {
    track: {
      type: Object as PropType<App.TrackDetail>,
      required: true,
    },
  },

  data(): Data {
    return {
      MENU_BACKGROUND_COLOR,
    };
  },

  computed: {
    menuItemLists(): MenuItem[][] {
      const addItemToQueue = {
        name: '次に再生に追加',
        handler: () => {
          this.$spotify.player.addItemToQueue({
            uri: this.track.uri,
          }).then(() => {
            this.$toast.show(undefined, `"${this.track.name}" を次に再生に追加しました。`);
          }).catch((err: Error) => {
            console.error({ err });
            this.$toast.show('error', `"${this.track.name}" を次に再生に追加できませんでした。`);
          });
        },
      };

      const artist = this.track.artistList[0] as App.SimpleArtistInfo | undefined;
      const artistPageItem = {
        name: 'アーティストページに移動',
        to: `/artists/${artist?.id}`,
        disabled: artist == null || this.$route.params.artistId === artist.id,
      };

      const releasePageItem = {
        name: 'アルバムページに移動',
        to: `/releases/${this.track.releaseId}`,
        disabled: this.$route.params.releaseId === this.track.releaseId,
      };

      const saveTrackItem = this.track.isSaved
        ? {
          name: 'お気に入りから削除',
          handler: () => {
            this.$dispatch('library/tracks/removeTracks', [this.track.id]);
          },
        }
        : {
          name: 'お気に入りに追加',
          handler: () => {
            this.$dispatch('library/tracks/saveTracks', [this.track.id]);
          },
        };

      const menuItemList = [
        [addItemToQueue],
        [artistPageItem, releasePageItem],
        [saveTrackItem],
      ];

      return menuItemList;
    },
  },
});
</script>
