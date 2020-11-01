<template>
  <div>
    <v-select
      v-model="searchText"
      dense
      :items="selectItems"
      :class="$style.EpisodeSelect"
    />

    <v-data-table
      disable-pagination
      hide-default-footer
      :headers="headers"
      :items="episodes"
      :mobile-breakpoint="0"
      :search="searchText"
      :custom-filter="customFilter"
      :no-data-text="noDataText"
      class="episode-table"
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
          :set="isEpisodeSet(item.id)"
          :playing="isPlayingEpisode(item.id)"
          @on-row-clicked="onRowClicked"
          @on-media-button-clicked="onMediaButtonClicked"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import type { DataTableHeader } from 'vuetify';

import EpisodeTableRow, { On as OnRow } from '~/components/parts/table/EpisodeTableRow.vue';
import type { App } from '~~/types';

type EpisodeSelector = 'all' | 'inProgress' | 'unplayed';
type SelectItem = {
  text: string;
  value: EpisodeSelector;
}

type Data = {
  searchText: EpisodeSelector;
  selectItems: SelectItem[];
  customFilter: (value: any, search: EpisodeSelector, item: App.EpisodeDetail) => boolean;
};

export default Vue.extend({
  components: {
    EpisodeTableRow,
  },

  props: {
    episodes: {
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
    const customFilter = (
      _: any,
      search: EpisodeSelector,
      item: App.EpisodeDetail,
    ): boolean => {
      const position = item.resumePoint.resume_position_ms;
      const isFulllyPlayed = item.resumePoint.fully_played;
      switch (search) {
        case 'inProgress':
          return position > 0 && !isFulllyPlayed;
        case 'unplayed':
          return position === 0;
        case 'all':
          return true;
        default:
          return true;
      }
    };

    const selectItems: SelectItem[] = [
      {
        text: 'すべてのエピソード',
        value: 'all' as const,
      },
      {
        text: '未再生のエピソード',
        value: 'unplayed' as const,
      },
      {
        text: '再生中のエピソード',
        value: 'inProgress' as const,
      },
    ];

    return {
      searchText: 'all',
      selectItems,
      customFilter,
    };
  },

  computed: {
    buttonSize(): number {
      return this.$screen.isMultiColumn
        ? 36
        : 32;
    },
    headers(): DataTableHeader[] {
      const totalSidePadding = 12;
      // width は 左右の padding を含めた幅
      const buttonColumnWidth = totalSidePadding + this.buttonSize;
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
        width: this.$screen.isMultiColumn
          ? 60 + totalSidePadding
          : 44 + totalSidePadding,
      };
      const addedAtColumn = {
        text: '',
        value: 'addedAt',
        width: 72,
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
        width: buttonColumnWidth,
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };

      // addedAt が有効かどうか
      const headers: (DataTableHeader | undefined)[] = this.$screen.isSingleColumn
        ? [
          titleColumn,
          progressColumn,
          menuColumn,
        ]
        : [
          mediaButtonColumn,
          titleColumn,
          progressColumn,
          this.addedAt ? addedAtColumn : undefined,
          durationColumn,
          menuColumn,
        ];
      return headers.filter((header) => header != null) as DataTableHeader[];
    },
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
          offset: { uri },
        });
      }
    },
    onRowClicked(row: OnRow['on-row-clicked']) {
      if (this.$screen.isSingleColumn) {
        this.onMediaButtonClicked(row);
      }
    },
  },
});
</script>

<style lang="scss" module>
.EpisodeSelect {
  max-width: 300px;
}
</style>

<style lang="scss">
.episode-table {
  @include v-data-table-height(64px);
}
</style>
