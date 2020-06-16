<template>
  <v-data-table
    :headers="headers"
    :items="items"
    group-by="discNumber"
    disable-pagination
    disable-sort
    hide-default-footer
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

import TrackTableRow, { On } from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  items: App.TrackDetail[]
  activeRowId: string | undefined
};

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
    const headers = [
      {
        text: '#',
        value: 'index',
        width: 44,
        align: 'center' as const,
      },
      {
        text: '',
        value: 'isSaved',
        width: 52,
        align: 'center' as const,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
      {
        text: '',
        value: 'duration',
        width: 60,
        align: 'center' as const,
      },
      {
        text: '',
        value: 'menu',
        width: 60,
        align: 'center' as const,
      },
    ];
    const items = this.trackList;

    const hash = this.$route.hash.replace('#', '');
    const activeRowId = items.find((item) => item.hash === hash)?.id;

    return {
      headers,
      items,
      activeRowId,
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
    hasMultipleDiscs(): boolean {
      const discNumberList = Array.from(
        new Set(this.items.map((item) => item.discNumber)),
      );

      return discNumberList.length > 1;
    },
    isActiveRow(): (id: string) => boolean {
      return (id: string) => this.activeRowId === id;
    },
  },

  methods: {
    onMediaButtonClicked(row: On['on-media-button-clicked']) {
      if (this.isPlayingTrack(row.id)) {
        this.$dispatch('player/pause');
      } else {
        this.$dispatch('player/play', {
          contextUri: this.uri,
          offset: {
            uri: row.uri,
          },
        });
      }
    },
    async onFavoriteButtonClicked(row: On['on-favorite-button-clicked']) {
      const nextSavedState = !row.isSaved;
      const modifySavedState = (isSaved: boolean, index: number) => this.items
        .map((item, i) => (i === index
          ? { ...item, isSaved }
          : item));

      // API との通信の結果を待たずに先に表示を変更させておく
      this.items = modifySavedState(nextSavedState, row.index);
      if (nextSavedState) {
        await this.$dispatch('library/tracks/saveTracks', [row.id]);
      } else {
        await this.$dispatch('library/tracks/removeTracks', [row.id]);
      }

      const [isSaved] = await this.$spotify.library.checkUserSavedTracks({
        trackIdList: [row.id],
      });
      // 実際の状態と異なれば戻す
      if (isSaved !== nextSavedState) this.items = modifySavedState(isSaved, row.index);
    },
    onRowClicked({ id }: On['on-row-clicked']) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss" module>
.TrackTable {
  // 表の背景を透過にする
  background-color: rgba(0, 0, 0, 0)!important;
  // 表全体の背景と同じ色にする
  table {
    // 表と列の幅を最初の行のセルの幅に固定して設定
    table-layout:fixed;
    tr {
      td, th {
        padding: 0 8px;
        // 列の幅をデフォルトの 48px から少し狭める
        height: 44px!important;
      }
    }
  }
}
</style>

<style lang="scss">
.TrackTable {
  .v-row-group__header {
    // 表全体の背景と同じ色にする
      background: inherit!important;
  }
}
</style>
