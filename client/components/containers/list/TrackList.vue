<template>
  <v-list
    dense
    :color="BACKGROUND_COLOR"
  >
    <template v-for="track in trackList">
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

import TrackListItem, { TrackDetail, On as OnListItem } from '~/components/parts/list/TrackListItem.vue';
import { BACKGROUND_COLOR } from '~/variables';

export { TrackDetail } from '~/components/parts/list/TrackListItem.vue';

export type Data = {
  trackUriList: string[]
  BACKGROUND_COLOR: typeof BACKGROUND_COLOR
}

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnListItem['on-favorite-button-clicked']
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
    // trackUriList は更新されることがない
    const trackUriList = this.trackList.map((track) => track.uri);
    return {
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
    // id, uri は track のパラメータで、this.uri は context のパラメータ
    onMediaButtonClicked({ id, uri }: OnListItem['on-media-button-clicked']) {
      if (this.isPlayingTrack(id)) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play', {
          trackUriList: this.trackUriList,
          offset: { uri },
        });
        this.$dispatch('player/setCustomContext', {
          contextUri: this.uri,
          trackUriList: this.trackUriList,
        });
      }
    },

    // row をコピーしたものを参照する
    async onFavoriteButtonClicked({ ...row }: OnListItem['on-favorite-button-clicked']) {
      const params: On['on-favorite-button-clicked'] = row;
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, params);

      // API との通信の結果を待たずに先に表示を変更させておく
      const { id, nextSavedState } = row;
      if (nextSavedState) {
        await this.$dispatch('library/tracks/saveTracks', [id]);
      } else {
        await this.$dispatch('library/tracks/removeTracks', [id]);
      }
    },
  },
});
</script>
