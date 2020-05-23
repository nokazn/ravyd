<template>
  <v-data-table
    :headers="headers"
    :items="items"
    group-by="discNumber"
    disable-pagination
    disable-sort
    hide-default-footer
    class="track-list-table">
    <template #header.duration>
      <v-icon
        :size="16"
        color="grey">
        mdi-clock-outline
      </v-icon>
    </template>

    <template #group.header="{ group }">
      <track-list-table-group-header
        v-if="hasMultipleDiscs"
        :disc-number="group"
        :colspan="headers.length" />
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

import TrackListTableRow from '~/components/parts/table/TrackListTableRow.vue';
import TrackListTableGroupHeader from '~/components/parts/table/TrackListTableGroupHeader.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  items: App.TrackDetail[]
};

export default Vue.extend({
  components: {
    TrackListTableRow,
    TrackListTableGroupHeader,
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
        value: 'explicit',
        width: 60,
        align: 'center' as const,
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
    const items = this.trackList;

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
    hasMultipleDiscs(): boolean {
      const discNumberList = Array.from(new Set(this.items
        .map((item) => item.discNumber)));

      return discNumberList.length > 1;
    },
  },

  methods: {
    onMediaButtonClicked(row: App.TrackDetail) {
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
    async onFavoriteButtonClicked(row: App.TrackDetail) {
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

<style lang="scss">
.track-list-table {
  // 表全体の背景と同じ色にする
  .v-row-group__header {
    background: inherit!important;
  }
  td, th {
    // 列の幅をデフォルトの 48px から少し狭める
    height: 44px!important;
  }
}
</style>
