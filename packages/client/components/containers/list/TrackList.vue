<template>
  <v-list
    dense
    :color="$constant.BACKGROUND_COLOR"
  >
    <template v-for="(track, i) in tracks">
      <v-divider
        v-show="isVisible(i)"
        :key="`${track.id}-divider`"
      />
      <TrackListItem
        v-show="isVisible(i)"
        :key="track.id"
        :item="track"
        :set="isTrackSet(track)"
        :playing="isPlayingTrack(track)"
        @on-media-button-clicked="onMediaButtonClicked"
        @on-favorite-button-clicked="onFavoriteButtonClicked"
      />
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import TrackListItem, { On as OnListItem } from '~/components/parts/list/TrackListItem.vue';
import type { App } from '~/entities';

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnListItem['on-favorite-button-clicked']
}

export default defineComponent({
  components: {
    TrackListItem,
  },

  props: {
    tracks: {
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

  setup(props, { root, emit }) {
    // context は更新されることがない
    const context = props.tracks.map((track) => track.uri);
    const isTrackSet = (row: App.MinimumTrack | undefined) => root.$getters()['playback/isTrackSet'](row);
    const isPlayingTrack = (row: App.MinimumTrack) => isTrackSet(row) && root.$getters()['playback/isPlaying'];
    const isVisible = (index: number) => props.length == null || index < props.length;

    // id, uri は track のパラメータで、this.uri は context のパラメータ
    const onMediaButtonClicked = (row: OnListItem['on-media-button-clicked']) => {
      if (isPlayingTrack(row)) {
        root.$dispatch('playback/pause');
      } else if (isTrackSet(row)) {
        root.$dispatch('playback/play');
      } else {
        root.$dispatch('playback/play', {
          context,
          track: row,
        });
        // アーティストの contextUri から直接再生はできない
        root.$dispatch('playback/setCustomContext', {
          contextUri: props.uri,
          trackUriList: context,
        });
      }
    };
    const onFavoriteButtonClicked = (row: OnListItem['on-favorite-button-clicked']) => {
      emit(ON_FAVORITE_BUTTON_CLICKED, row);
    };

    return {
      isTrackSet,
      isPlayingTrack,
      isVisible,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
    };
  },
});
</script>
