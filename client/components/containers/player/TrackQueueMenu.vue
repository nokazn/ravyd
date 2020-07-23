<template>
  <v-menu
    :key="trackQueue.length"
    v-model="isShown"
    top
    left
    offset-y
    :z-index="Z_INDEX"
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
        v-if="trackQueue.length > 0"
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

      <div
        v-else
        :class="$style['TrackQueueMenu__wrapper--empty']"
      >
        再生待ちの曲はありません。
      </div>

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
import { RootGetters } from 'typed-vuex';

import TrackQueueMenuItem, { On as OnItem } from '~/components/parts/list/TrackQueueMenuItem.vue';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';

type Data = {
  isShown: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
  Z_INDEX: number
}

export default Vue.extend({
  components: {
    TrackQueueMenuItem,
  },

  data(): Data {
    return {
      isShown: false,
      MENU_BACKGROUND_COLOR,
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    trackQueue(): RootGetters['playback/trackQueue'] {
      return this.$getters()['playback/trackQueue'];
    },
  },

  methods: {
    async onItemClicked({ index }: OnItem['on-item-clicked']) {
      const isNext = index > 0;
      const counts = Math.abs(index);

      // @todo #174 次に再生に追加した曲が再生できないのに対処するため
      for (let i = 0; i < counts; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.$dispatch(isNext
          ? 'playback/next'
          : 'playback/previous');
      }

      // const { contextUri, customTrackUriList } = this.$state().player;

      // album と playlist は contextUri + offset で操作できる
      // if (contextUri != null && /album|playlist/.test(contextUri)) {
      //   // @todo #54 プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
      //   this.$dispatch('playback/play', {
      //     contextUri,
      //     offset: customTrackUriList != null && contextUri.includes('playlist')
      //       ? { position: customTrackUriList?.findIndex((trackUri) => trackUri === uri) }
      //       : { uri },
      //   });
      // } else {
      //   // playback-sdk から提供される contextUri が不適当かどうかで場合分け
      //   const trackUriList = contextUri == null && customTrackUriList != null
      //     ? customTrackUriList
      //     : this.trackQueue.map((track) => track.uri);
      //   this.$dispatch('playback/play', {
      //     trackUriList,
      //     offset: { uri },
      //   });
      // }
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
  max-width: min(500px, 80vw);

  &__header {
    margin-left: 12px;
  }

  &__wrapper {
    min-height: 72px;
    // header と footer の分を差し引く
    max-height: calc(70vh - 80px);
    overflow-y: auto;

    &--empty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5em 1em;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
