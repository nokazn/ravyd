<template>
  <v-menu
    :key="trackQueue.length"
    v-model="isShown"
    top
    left
    offset-y
    :z-index="1001"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :width="36"
        :height="36"
        title="再生リスト"
        v-on="on"
        @click="toggleMenu"
      >
        <v-icon>
          mdi-playlist-play
        </v-icon>
      </v-btn>
    </template>

    <v-list
      dense
      :elevation="12"
      subheader
      :color="MENU_BACKGROUND_COLOR"
      :class="$style.TrackQueueMenu"
    >
      <v-subheader :class="$style.TrackQueueMenu__header">
        再生リスト
      </v-subheader>

      <v-divider />

      <v-list-item-group
        :class="$style.TrackQueueMenu__wrapper"
        class="g-custom-scroll-bar"
      >
        <TrackQueueMenuItem
          v-for="(track, index) in trackQueue"
          :key="`${track.id}-${index}`"
          v-bind="track"
          @on-item-clicked="onItemClicked"
          @on-link-clicked="toggleMenu"
        />
      </v-list-item-group>

      <v-divider />

      <div :class="$style.TrackQueueMenu__footer">
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
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

import TrackQueueMenuItem, { On as OnItem } from '~/components/parts/list/TrackQueueMenuItem.vue';
import { MENU_BACKGROUND_COLOR, TRACK_QUEUE_ARTWORK_SIZE } from '~/variables';
import { App } from '~~/types';

type Data = {
  isShown: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
}

export default Vue.extend({
  components: {
    TrackQueueMenuItem,
  },

  data(): Data {
    return {
      isShown: false,
      MENU_BACKGROUND_COLOR,
    };
  },

  computed: {
    trackQueue(): App.TrackQueueInfo[] {
      return this.$getters()['player/trackQueue'](TRACK_QUEUE_ARTWORK_SIZE);
    },
  },

  methods: {
    onItemClicked(uri: OnItem['on-item-clicked']) {
      const { contextUri, customTrackUriList } = this.$state().player;

      // album と playlist は contextUri + offset で操作できる
      if (contextUri != null && /album|playlist/.test(contextUri)) {
        // @todo #54 プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
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
    toggleMenu() {
      this.isShown = !this.isShown;
    },
  },
});
</script>

<style lang="scss" module>
.TrackQueueMenu {
  min-width: 400px;
  max-width: min(500px, 60vw);

  &__header {
    margin-left: 12px;
  }

  &__wrapper {
    min-height: 72px;
    // header と footer の分を差し引く
    max-height: calc(70vh - 80px);
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
