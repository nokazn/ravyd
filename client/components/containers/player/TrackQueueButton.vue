<template>
  <v-menu
    v-model="isShown"
    bottom
    left
    :nudge-bottom="40"
    :nudge-left="20"
    :min-width="400"
    :max-width="500"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :width="36"
        :height="36"
        title="再生リスト"
        v-on="on"
        @click="toggleTrackList"
      >
        <v-icon>
          mdi-playlist-play
        </v-icon>
      </v-btn>
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="MENU_BACKGROUND_COLOR"
        :class="$style.DeviceSelectMenuList"
      >
        <v-subheader :class="$style.DeviceSelectMenuList__header">
          再生リスト
        </v-subheader>

        <v-divider />

        <v-list-item-group>
          <v-list-item
            v-for="(track) in trackQueue"
            :key="track.id"
            dense
            three-line
            :input-valuea="track.id"
            :title="`${track.name} を再生`"
            :class="$style.DeviceSelectMenuList__listItem"
            @click="listItemHandler(track.uri)"
          >
            <v-list-item-avatar tile>
              <ReleaseArtwork
                :src="track.artworkSrc"
                :alt="track.name"
                :title="track.name"
                :size="40"
              />
            </v-list-item-avatar>

            <v-list-item-content :class="$style.DeviceSelectMenuList__listItemContent">
              <div>
                <div
                  :class="[
                    $style.DeviceSelectMenuList__listItemTitle,
                    trackNameColor(track.isPlaying),
                  ]"
                  class="g-ellipsis-text"
                  v-text="track.name"
                />

                <v-list-item-subtitle
                  :class="[
                    $style.DeviceSelectMenuList__listItemSubtitle,
                    subtextColor(track.isPlaying),
                  ]"
                >
                  <nuxt-link
                    :to="`/releases/${track.releaseId}`"
                    :title="track.releaseName"
                    class="g-ellipsis-text"
                    @click.native.stop="toggleTrackList"
                    v-text="track.releaseName"
                  />
                  <ArtistNames
                    :artist-list="track.artistList"
                    :title="artistNames(track.artistList)"
                    class="g-ellipsis-text"
                    @on-clicked="toggleTrackList"
                  />
                </v-list-item-subtitle>
              </div>

              <v-icon
                v-if="track.isPlaying"
                :size="20"
                color="active"
                title="再生中"
              >
                mdi-volume-high
              </v-icon>
            </v-list-item-content>

            <v-list-item-action>
              <span
                class="g-small-text"
                :class="subtextColor(track.isPlaying)"
              >
                {{ track.duration }}
              </span>
            </v-list-item-action>
          </v-list-item>

          <v-divider />

          <div :class="$style.DeviceSelectMenuList__moreButton">
            <v-btn
              rounded
              text
              small
              nuxt
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
import { MENU_BACKGROUND_COLOR, TRACK_QUEUE_ARTWORK_SIZE } from '~/variables';
import { App } from '~~/types';

type Data = {
  isShown: boolean
  trackNameColor: (isPlaying: boolean) => string | undefined
  subtextColor: (isPlaying: boolean) => string | undefined
  artistNames: (artistList: App.SimpleArtistInfo[]) => string
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
  },

  data(): Data {
    return {
      isShown: false,
      trackNameColor: (isPlaying: boolean) => (isPlaying ? 'active--text' : undefined),
      subtextColor: (isPlaying: boolean) => (isPlaying ? 'active--text' : 'subtext--text'),
      artistNames: (artistList) => artistList.map((artist) => artist.name).join(', '),
      MENU_BACKGROUND_COLOR,
    };
  },

  computed: {
    trackQueue(): App.TrackQueueInfo[] {
      const artworkSize = TRACK_QUEUE_ARTWORK_SIZE;
      return this.$getters()['player/trackQueue'](artworkSize);
    },
  },

  methods: {
    toggleTrackList() {
      this.isShown = !this.isShown;
    },
    listItemHandler(uri: string) {
      const { contextUri, customTrackUriList } = this.$state().player;

      // album と playlist は contextUri + offset で操作できる
      if (contextUri != null && /album|playlist/.test(contextUri)) {
        // @todo プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
        this.$dispatch('player/play', {
          contextUri,
          offset: customTrackUriList != null && contextUri.includes('playlist')
            ? { position: customTrackUriList?.findIndex((trackUri) => trackUri === uri) }
            : { uri },
        });
      } else {
        // playback-sdk から提供される contextUri が不適当かどうかで場合分け
        const trackUriList = contextUri == null && customTrackUriList != null
          ? customTrackUriList
          : this.trackQueue.map((track) => track.uri);
        this.$dispatch('player/play', {
          trackUriList,
          offset: { uri },
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

  &__listItem {
    &Content {
      display: grid;
      grid-template-columns: auto 20px;
      column-gap: 12px;

      & > *:first-child {
        overflow-x: hidden;
      }
    }

    &Title {
      font-size: 0.9em;
      line-height: 1.1rem;
    }

    &Subtitle {
      font-size: 0.8em !important;
      line-height: 1.1rem !important;
    }
  }

  &__moreButton {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
