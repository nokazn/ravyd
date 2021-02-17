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
        :set="isTrackSet(track.id)"
        :playing="isPlayingTrack(track.id)"
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
    // trackUriList は更新されることがない
    const trackUriList = props.tracks.map((track) => track.uri);

    const isTrackSet = (id: string | undefined) => root.$getters()['playback/isTrackSet'](id);
    const isPlayingTrack = (id: string) => isTrackSet(id) && root.$state().playback.isPlaying;
    const isVisible = (index: number) => props.length == null || index < props.length;

    // id, uri は track のパラメータで、this.uri は context のパラメータ
    const onMediaButtonClicked = (row: OnListItem['on-media-button-clicked']) => {
      if (isPlayingTrack(row.id)) {
        root.$dispatch('playback/pause');
      // TODO: relinked track を参照する必要性
      } else if (isTrackSet(row.id) || isTrackSet(row.linkedFrom?.id)) {
        root.$dispatch('playback/play');
      } else {
        root.$dispatch('playback/play', {
          trackUriList,
          offset: { uri: row.uri },
        });
        // アーティストの contextUri から直接再生はできない
        root.$dispatch('playback/setCustomContext', {
          contextUri: props.uri,
          trackUriList,
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
