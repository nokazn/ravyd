<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-pagination
    disable-sort
    hide-default-footer
    @click:row="onClickRow">
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
      type: Array as PropType<SpotifyAPI.SimpleAlbum[]>,
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
        width: 40,
      },
      {
        text: ' ',
        value: 'like',
        width: 24,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
    ];

    const items = this.trackList.map((track, i) => ({
      index: i + 1,
      id: track.id,
      name: track.name,
      like: this.isTrackFavoritedList[i],
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

  methods: {
    onClickRow(item: RowItem) {
      console.log('row', item);
    },
  },
});
</script>

<style lang="scss" module>
.Row {
  &__id {
    width: 52px;
  }
  &__name[data-is-track-set=true] {
    color: #00E5FF;
  }
}
</style>
