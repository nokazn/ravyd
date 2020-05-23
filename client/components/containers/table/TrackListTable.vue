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
        :uri="uri"
        @on-media-button-clicked="onMediaButtonClicked"
        @on-favorite-button-clicked="onFavoriteButtonClicked" />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import TrackListTableRow, { RowItem } from '~/components/parts/table/TrackListTableRow.vue';
import { parseTrackDetail } from '~/scripts/parser/parseTrackDetail';
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
    isTrackSavedList: {
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
        value: 'isSaved',
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
        value: 'menu',
        width: 60,
        align: 'center' as const,
      },
    ];

    const items = this.trackList.map(parseTrackDetail(this.isTrackSavedList));

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
    onMediaButtonClicked(row: RowItem) {
      if (this.isPlayingTrack(row.id)) {
        this.$dispatch('player/pause');
      } else if (this.isTrackSet(row.id)) {
        this.$dispatch('player/play');
      } else {
        this.$dispatch('player/play', {
          contextUri: this.uri,
          offset: {
            uri: row.uri,
          },
        });
      }
    },
    async onFavoriteButtonClicked(row: RowItem) {
      const nextSavedState = !row.isSaved;
      const modifyedItems = (isSaved: boolean, index: number) => this.items
        .map((item, i) => (i === index
          ? { ...item, isSaved }
          : item));

      // API との通信の結果を待たずに先に表示を変更させておく
      this.items = modifyedItems(nextSavedState, row.index);
      if (nextSavedState) {
        await this.$dispatch('library/saveTracks', [row.id]);
      } else {
        await this.$dispatch('library/removeTracks', [row.id]);
      }

      const [isSaved] = await this.$spotify.library.checkUserSavedTracks({
        trackIdList: [row.id],
      });
      // 実際の状態と異なれば戻す
      if (isSaved !== nextSavedState) this.items = modifyedItems(isSaved, row.index);
    },
  },
});
</script>
