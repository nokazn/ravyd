<template>
  <client-only>
    <v-data-table
      :headers="headers"
      :items="episodeList"
      disable-pagination
      hide-default-footer
      :no-data-text="noDataText"
      :class="$style.EpisodeTable"
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

      <template #header.addedAt>
        <v-icon
          :size="16"
          color="subtext"
          title="公開日"
        >
          mdi-calendar-outline
        </v-icon>
      </template>

      <template #item="{ item }">
        <EpisodeTableRow
          :item="item"
          :publisher="publisher"
          :added-at="addedAt"
          :is-active="item.id === activeRowId"
          :is-episode-set="isEpisodeSet(item.id)"
          :is-playing-episode="isPlayingEpisode(item.id)"
          @on-row-clicked="onRowClicked"
          @on-media-button-clicked="onMediaButtonClicked"
        />
      </template>
    </v-data-table>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import EpisodeTableRow, { On as OnRow } from '~/components/parts/table/EpisodeTableRow.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  activeRowId: string | undefined
};

export default Vue.extend({
  components: {
    EpisodeTableRow,
  },

  props: {
    episodeList: {
      type: Array as PropType<App.EpisodeDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    noDataText: {
      type: String,
      default: 'エピソードがありません。',
    },
    addedAt: {
      type: Boolean,
      default: true,
    },
  },

  data(): Data {
    // 左右の padding: 8px を含めた幅
    const mediaButtonColumn = {
      text: '',
      value: 'index',
      width: 60,
      sortable: false,
      filterable: false,
    };
    const titleColumn = {
      text: 'タイトル',
      value: 'name',
    };
    const progressColumn = {
      text: '進捗',
      value: 'resumePoint',
      width: 72,
      align: 'center' as const,
    };
    const addedAtColumn = {
      text: '',
      value: 'addedAt',
      width: 72,
      align: 'center' as const,
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
      sortable: false,
      filterable: false,
    };

    // addedAt が有効かどうか
    const headers = this.addedAt
      ? [
        mediaButtonColumn,
        titleColumn,
        progressColumn,
        addedAtColumn,
        durationColumn,
        menuColumn,
      ]
      : [
        mediaButtonColumn,
        titleColumn,
        progressColumn,
        durationColumn,
        menuColumn,
      ];

    return {
      headers,
      activeRowId: undefined,
    };
  },

  computed: {
    isEpisodeSet(): (episodeId: string) => boolean {
      return (episodeId: string) => this.$getters()['playback/isTrackSet'](episodeId);
    },
    isPlayingEpisode(): (episodeId: string) => boolean {
      return (episodeId: string) => this.isEpisodeSet(episodeId)
        && this.$state().playback.isPlaying;
    },
  },

  methods: {
    onMediaButtonClicked({ id, uri }: OnRow['on-media-button-clicked']) {
      if (this.isPlayingEpisode(id)) {
        this.$dispatch('playback/pause');
      } else {
        this.$dispatch('playback/play', {
          contextUri: this.uri,
          offset: {
            uri,
          },
        });
      }
    },
    onRowClicked({ id }: OnRow['on-row-clicked']) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss" module>
.EpisodeTable {
  // 表の背景を透過にし、全体の背景と同じ色にする
  background-color: rgba(0, 0, 0, 0) !important;

  table {
    // 表と列の幅を最初の行のセルの幅に固定して設定
    table-layout: fixed;

    tr {
      td,
      th {
        padding: 0 8px !important;
      }
    }
  }
}

</style>
