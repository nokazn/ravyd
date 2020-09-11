<template>
  <client-only>
    <v-data-table
      :headers="headers"
      :items="trackList"
      group-by="discNumber"
      disable-pagination
      disable-sort
      hide-default-footer
      no-data-text="トラックがありません。"
      class="TrackTable"
    >
      <template #header.duration>
        <v-icon
          :size="16"
          color="subtext"
          title="再生時間"
        >
          mdi-clock-outline
        </v-icon>
      </template>

      <template #group.header="{ group }">
        <TrackTableGroupHeader
          v-if="hasMultipleDiscs"
          :disc-number="group"
          :colspan="headers.length"
        />
      </template>

      <template #item="{ item }">
        <TrackTableRow
          :item="item"
          :is-active="item.id === activeRowId"
          :is-track-set="isTrackSet(item.id)"
          :is-playing-track="isPlayingTrack(item.id)"
          @on-row-clicked="onRowClicked"
          @on-media-button-clicked="onMediaButtonClicked"
          @on-favorite-button-clicked="onFavoriteButtonClicked"
        />
      </template>
    </v-data-table>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import TrackTableRow, { On as OnRow } from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import { getQuery } from '~/utils/text';
import { App } from '~~/types';

type Data = {
  headers: DataTableHeader[]
  activeRowId: string | undefined
};

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnRow['on-favorite-button-clicked']
}

export default Vue.extend({
  components: {
    TrackTableRow,
    TrackTableGroupHeader,
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
    // 左右の padding: 8px を含めた幅
    const indexColumn = {
      text: '#',
      value: 'index',
      width: 44,
      align: 'center' as const,
    };
    const isSavedColumn = {
      text: '',
      value: 'isSaved',
      width: 52,
      align: 'center' as const,
    };
    const nameColumn = {
      text: 'タイトル',
      value: 'name',
    };
    const durationColumn = {
      text: '',
      value: 'duration',
      width: 72,
      align: 'center' as const,
    };
    const menuColumn = {
      text: '',
      value: 'menu',
      width: 60,
      align: 'center' as const,
    };
    const headers = [indexColumn, isSavedColumn, nameColumn, durationColumn, menuColumn];
    const trackId = getQuery(this.$route.query, 'track');
    const activeRowId = trackId != null
      ? this.trackList.find((item) => item.id === trackId)?.id
      : undefined;

    return {
      headers,
      activeRowId,
    };
  },

  computed: {
    isTrackSet(): (trackId: string) => boolean {
      return (trackId: string) => this.$getters()['playback/isTrackSet'](trackId);
    },
    isPlayingTrack(): (trackId: string) => boolean {
      return (trackId: string) => this.isTrackSet(trackId)
        && this.$state().playback.isPlaying;
    },
    // relink されたトラックがある場合はディスクによるグループ表示は行わない
    hasMultipleDiscs(): boolean {
      const { trackList } = this;
      const relinkedTrack = trackList.find((track) => track.linkedFrom != null);
      const discNumberList = Array.from(new Set(trackList
        .map((track) => track.discNumber)));

      return relinkedTrack != null
        ? false
        : discNumberList.length > 1;
    },
    isActiveRow(): (id: string) => boolean {
      return (id: string) => this.activeRowId === id;
    },
  },

  methods: {
    onMediaButtonClicked(row: OnRow['on-media-button-clicked']) {
      if (this.isPlayingTrack(row.id)) {
        this.$dispatch('playback/pause');
        return;
      }

      const offset = row.linkedFrom != null
        ? { position: row.index }
        : { uri: row.uri };

      this.$dispatch('playback/play', {
        contextUri: this.uri,
        offset,
      });
    },
    // row をコピーしたものを参照する
    onFavoriteButtonClicked({ ...row }: OnRow['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
    onRowClicked({ id }: OnRow['on-row-clicked']) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss">
.TrackTable {
  // 表の背景を透過にし、全体の背景と同じ色にする
  background-color: rgba(0, 0, 0, 0) !important;

  table {
    // 表と列の幅を最初の行のセルの幅に固定して設定
    table-layout: fixed;

    tr {
      td,
      th {
        padding: 0 8px !important;
        // 列の幅をデフォルトの 48px から少し狭める
        height: 44px !important;
      }
    }
  }

  .v-row-group__header {
    // 表全体の背景と同じ色にする
    background: inherit !important;
  }
}
</style>
