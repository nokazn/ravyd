<template>
  <v-list
    dense
    :color="$constant.BACKGROUND_COLOR"
  >
    <template v-for="track in trackList">
      <v-divider
        v-show="length == null || track.index < length"
        :key="`${track.id}-divider`"
      />
      <TrackListItem
        v-show="length == null || track.index < length"
        :key="track.id"
        :item="track"
        :is-playing-track="isPlayingTrack(track.id)"
        :is-track-set="isTrackSet(track.id)"
        @on-media-button-clicked="onMediaButtonClicked"
        @on-favorite-button-clicked="onFavoriteButtonClicked"
      />
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import TrackListItem, { On as OnListItem } from '~/components/parts/list/TrackListItem.vue';
import { App } from '~~/types';

export type Data = {
  trackUriList: string[]
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
      type: Array as PropType<App.TrackDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    length: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    // trackUriList は更新されることがない
    const trackUriList = this.trackList.map((track) => track.uri);
    return {
      trackUriList,
    };
  },

  computed: {
    isTrackSet(): (id: string) => boolean {
      return (id: string) => this.$getters()['playback/isTrackSet'](id);
    },
    isPlayingTrack(): (id: string) => boolean {
      return (id: string) => this.isTrackSet(id)
        && this.$state().playback.isPlaying;
    },
  },

  methods: {
    // id, uri は track のパラメータで、this.uri は context のパラメータ
    onMediaButtonClicked({ id, uri }: OnListItem['on-media-button-clicked']) {
      if (this.isPlayingTrack(id)) {
        this.$dispatch('playback/pause');
      } else {
        this.$dispatch('playback/play', {
          trackUriList: this.trackUriList,
          offset: { uri },
        });
        // アーティストの contextUri から直接再生はできない
        this.$dispatch('playback/setCustomContext', {
          contextUri: this.uri,
          trackUriList: this.trackUriList,
        });
      }
    },

    onFavoriteButtonClicked(row: OnListItem['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
  },
});
</script>
