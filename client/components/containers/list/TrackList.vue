<template>
  <v-list
    dense
    :color="BACKGROUND_COLOR"
  >
    <template v-for="track in items">
      <v-divider
        v-show="track.index < length"
        :key="`${track.id}-divider`"
      />
      <TrackListItem
        v-show="track.index < length"
        :key="track.id"
        :is-playing-track="isPlayingTrack(track.id)"
        :is-track-set="isTrackSet(track.id)"
        v-bind="track"
        @on-media-button-clicked="onMediaButtonClicked"
        @on-favorite-button-clicked="onFavoriteButtonClicked"
      />
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackListItem, { TrackDetail, On } from '~/components/parts/list/TrackListItem.vue';
import { BACKGROUND_COLOR } from '~/variables';

export { TrackDetail } from '~/components/parts/list/TrackListItem.vue';

export type Data = {
  items: TrackDetail[]
  trackUriList: string[]
  BACKGROUND_COLOR: typeof BACKGROUND_COLOR
}

export default Vue.extend({
  components: {
    TrackListItem,
  },

  props: {
    trackList: {
      type: Array as PropType<TrackDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },

  data(): Data {
    const trackUriList = this.trackList.map((track) => track.uri);
    return {
      items: this.trackList,
      trackUriList,
      BACKGROUND_COLOR,
    };
  },

  computed: {
    isTrackSet(): (id: string) => boolean {
      return (id: string) => this.$getters()['player/isTrackSet'](id);
    },
    isPlayingTrack(): (id: string) => boolean {
      return (id: string) => this.isTrackSet(id)
        && this.$state().player.isPlaying;
    },
  },

  methods: {
    onMediaButtonClicked({ id, index }: On['on-media-button-clicked']) {
      if (this.isPlayingTrack(id)) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play', {
          trackUriList: this.trackUriList,
          offset: {
            position: index,
          },
        });
      }
    },
    async onFavoriteButtonClicked({ nextSavedState, id, index }: On['on-favorite-button-clicked']) {
      const modifySavedState = (isSaved: boolean, i: number) => this.items
        .map((item, j) => (j === i
          ? { ...item, isSaved }
          : item));

      // API との通信の結果を待たずに先に表示を変更させておく
      this.items = modifySavedState(nextSavedState, index);
      if (nextSavedState) {
        await this.$dispatch('library/tracks/saveTracks', [id]);
      } else {
        await this.$dispatch('library/tracks/removeTracks', [id]);
      }

      const [isSaved] = await this.$spotify.library.checkUserSavedTracks({
        trackIdList: [id],
      });
      // 実際の状態と異なれば戻す
      if (isSaved !== nextSavedState) this.items = modifySavedState(isSaved, index);
    },
  },
});
</script>
