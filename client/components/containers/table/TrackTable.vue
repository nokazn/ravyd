<template>
  <v-data-table
    v-if="isLoaded"
    :headers="headers"
    :items="trackList"
    group-by="discNumber"
    disable-pagination
    disable-sort
    hide-default-footer
    no-data-text="トラックがありません。"
    :class="$style.TrackTable"
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
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import TrackTableRow, { On as OnRow } from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import { App } from '~~/types';

export type Data = {
  isLoaded: boolean
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
      width: 60,
      align: 'center' as const,
    };
    const menuColumn = {
      text: '',
      value: 'menu',
      width: 60,
      align: 'center' as const,
    };
    const headers = [indexColumn, isSavedColumn, nameColumn, durationColumn, menuColumn];
    const hash = this.$route.hash.replace('#', '');
    const activeRowId = this.trackList.find((item) => item.hash === hash)?.id;

    return {
      isLoaded: false,
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
    hasMultipleDiscs(): boolean {
      const discNumberList = Array.from(
        new Set(this.trackList.map((track) => track.discNumber)),
      );

      return discNumberList.length > 1;
    },
    isActiveRow(): (id: string) => boolean {
      return (id: string) => this.activeRowId === id;
    },
  },

  mounted() {
    // サーバーサイドのコンテンツとクライアントサイドの仮想DOMが合致しなくなるのを避ける
    this.isLoaded = true;
  },

  methods: {
    onMediaButtonClicked(row: OnRow['on-media-button-clicked']) {
      if (this.isPlayingTrack(row.id)) {
        this.$dispatch('playback/pause');
      } else {
        this.$dispatch('playback/play', {
          contextUri: this.uri,
          offset: {
            uri: row.uri,
          },
        });
      }
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

<style lang="scss" module>
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
}
</style>

<style lang="scss">
.TrackTable {
  .v-row-group__header {
    // 表全体の背景と同じ色にする
    background: inherit !important;
  }
}
</style>
