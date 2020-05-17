<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer>
    <template #header.duration>
      <v-icon
        :size="16"
        color="grey">
        mdi-clock-outline
      </v-icon>
    </template>

    <template #item="{ item }">
      <track-list-table-row
        :item="item"
        :is-track-set="isTrackSet(item.id)"
        :is-playing-track="isPlayingTrack(item.id)"
        :media-button-icon="mediaButtonIcon(item.id)"
        :uri="uri" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import TrackListTableRow, { RowItem } from '~/components/parts/table/TrackListTableRow.vue';
import { elapsedTime } from '~~/utils/elapsedTime';
import { SpotifyAPI } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  items: RowItem[]
};

export default Vue.extend({
  components: {
    TrackListTableRow,
  },

  props: {
    trackList: {
      type: Array as PropType<SpotifyAPI.SimpleTrack[]>,
      required: true,
    },
    isTrackFavoritedList: {
      type: Array as PropType<boolean[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },

  data(): Data {
    const headers = [
      {
        text: '#',
        value: 'index',
        width: 60,
        align: 'center' as const,
      },
      {
        text: ' ',
        value: 'isFavorited',
        width: 60,
        align: 'center' as const,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
      {
        text: ' ',
        value: 'duration',
        width: 60,
        align: 'center' as const,
      },
      {
        text: ' ',
        value: 'popularity',
        width: 60,
        align: 'center' as const,
      },
    ];

    const items = this.trackList.map((track, i) => ({
      id: track.id,
      trackNumber: track.track_number,
      isFavorited: this.isTrackFavoritedList[i],
      name: track.name,
      duration: elapsedTime(track.duration_ms),
    }));

    return {
      headers,
      items,
    };
  },

  computed: {
    isTrackSet(): (trackId: string) => boolean {
      return (trackId: string) => this.$getters()['player/isTrackSet'](trackId);
    },
    isPlayingTrack(): (trackId: string) => boolean {
      return (trackId: string) => this.isTrackSet(trackId)
        && this.$state().player.isPlaying;
    },
    mediaButtonIcon(): (trackId: string) => 'mdi-play' | 'mdi-pause' {
      return (trackId: string) => (this.isPlayingTrack(trackId)
        ? 'mdi-pause'
        : 'mdi-play');
    },
  },
});
</script>
