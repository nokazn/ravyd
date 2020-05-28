<template>
  <v-menu
    v-model="isShown"
    top
    left
    :nudge-top="40"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        title="再生リスト"
        v-on="on"
        @click="onTrackListButtonClicked"
      >
        <v-icon :size="20">
          mdi-playlist-play
        </v-icon>
      </v-btn>
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="FOOTER_BACKGROUND_COLOR"
        :class="$style.DeviceSelectMenuList"
      >
        <v-subheader :class="$style.DeviceSelectMenuList__header">
          再生リスト
        </v-subheader>

        <v-divider />

        <v-list-item-group>
          <v-list-item
            v-for="(track, index) in trackQueue"
            :key="track.id"
            dense
            three-line
            :input-value="track.id"
            :class="$style.DeviceSelectMenuList__listItem"
            @click="onListItemClickedHandler(index, track.uri)"
          >
            <v-list-item-avatar tile>
              <ReleaseArtwork
                :src="track.artworkSrc"
                :alt="track.name"
                :title="track.name"
                :size="40"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <span
                :class="{
                  [$style.DeviceSelectMenuList__listItemTitle]: true,
                  'cyan--text text--accent-2': track.isPlaying
                }"
                v-text="track.name"
              />

              <v-list-item-subtitle
                :class="[
                  $style.DeviceSelectMenuList__listItemSubtitle,
                  track.isPlaying ? 'cyan--text text--accent-2' : 'grey--text text--lighten-1',
                ]"
              >
                <span v-text="track.albumName" />
                <ArtistNames :artist-list="track.artistList" />
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <div :class="$style.DeviceSelectMenuList__moreButton">
            <v-btn
              rounded
              text
              small
              to="/queue"
            >
              すべて表示
            </v-btn>
          </div>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { FOOTER_BACKGROUND_COLOR } from '~/variables';
import { App } from '~~/types';

type Data = {
  isShown: boolean
  FOOTER_BACKGROUND_COLOR: typeof FOOTER_BACKGROUND_COLOR
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
  },

  data(): Data {
    return {
      isShown: false,
      FOOTER_BACKGROUND_COLOR,
    };
  },

  computed: {
    trackQueue(): App.TrackQueueInfo[] {
      const artworkSize = 64;
      return this.$getters()['player/trackQueue'](artworkSize);
    },
  },

  methods: {
    onTrackListButtonClicked() {
      this.isShown = !this.isShown;
    },
    onListItemClickedHandler(index: number, uri: string) {
      const { contextUri } = this.$state().player;
      if (contextUri != null && /album|playlist/.test(contextUri)) {
        this.$dispatch('player/play', {
          contextUri,
          offset: { uri },
        });
      } else {
        this.$dispatch('player/play', {
          trackUriList: this.trackQueue.map((track) => track.uri),
          offset: { position: index },
        });
      }
    },
  },
});
</script>

<style lang="scss" module>
.DeviceSelectMenuList {
  &__header {
    margin-left: 12px;
  }
  &__listItemTitle {
    font-size: 0.9em;
  }
  &__listItemSubtitle {
    font-size: 0.7em!important;
  }

  &__moreButton {
    display: flex;
    justify-content: center;
    margin: 4px 0;
  }
}
</style>
