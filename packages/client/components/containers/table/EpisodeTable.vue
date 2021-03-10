<template>
  <div>
    <v-select
      v-model="select"
      dense
      :items="selectItems"
      :class="$style.EpisodeSelect"
    />

    <v-data-table
      disable-pagination
      hide-default-footer
      :mobile-breakpoint="0"
      :headers="headers"
      :items="episodes"
      :search="select"
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
          :set="isEpisodeSet(item)"
          :playing="isPlayingEpisode(item)"
          :hide-added-at="hideAddedAt"
          @on-media-button-clicked="onMediaButtonClicked"
          @on-row-clicked="onRowClicked"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
} from '@vue/composition-api';
import type { DataTableHeader, DataTableFilterFunction } from 'vuetify';
import EpisodeTableRow, { On as OnRow } from '~/components/parts/table/EpisodeTableRow.vue';
import { useButtonSize } from '~/use/style';
import type { App } from '~/entities';

type EpisodeSelector = 'all' | 'unplayed' | 'inProgress';
type SelectItem = {
  text: string;
  value: EpisodeSelector;
}

export default defineComponent({
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
    hideAddedAt: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root }) {
    const select = ref<EpisodeSelector>('all');

    const customFilter: DataTableFilterFunction = (_, search, item: App.EpisodeDetail) => {
      const position = item.resumePoint.resume_position_ms;
      const isFulllyPlayed = item.resumePoint.fully_played;
      switch (search as EpisodeSelector) {
        case 'inProgress':
          return position > 0 && !isFulllyPlayed;
        case 'unplayed':
          return position === 0 && !isFulllyPlayed;
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

    const headers = computed<DataTableHeader[]>(() => {
      const sidePadding = 12;
      const offset = 8;
      const buttonSize = useButtonSize(root);
      // width は 左右の padding を含めた幅
      const buttonColumnWidth = sidePadding + buttonSize.value;
      const mediaButtonColumn = {
        text: '',
        value: 'index',
        width: buttonColumnWidth + offset,
        sortable: false,
        filterable: false,
        align: 'center' as const,
      };
      const titleColumn = {
        text: 'タイトル',
        value: 'name',
      };
      const progressColumn = {
        text: '進捗',
        value: 'resumePoint',
        width: root.$screen.isSingleColumn
          ? 44 + sidePadding
          : 56 + sidePadding + offset,
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
        width: buttonColumnWidth,
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };
      // hideAddedAt が有効かどうか
      const h: (DataTableHeader | undefined)[] = root.$screen.isSingleColumn
        ? [
          titleColumn,
          progressColumn,
          menuColumn,
        ]
        : [
          mediaButtonColumn,
          titleColumn,
          progressColumn,
          props.hideAddedAt ? undefined : addedAtColumn,
          durationColumn,
          menuColumn,
        ];
      return h.filter((header) => header != null) as DataTableHeader[];
    });

    const isEpisodeSet = (row: App.MinimumTrack) => root.$getters()['playback/isTrackSet'](row);
    const isPlayingEpisode = (row: App.MinimumTrack) => isEpisodeSet(row) && root.$getters()['playback/isPlaying'];
    const onMediaButtonClicked = (row: OnRow['on-media-button-clicked']) => {
      if (isPlayingEpisode(row)) {
        root.$dispatch('playback/pause');
      } else if (isEpisodeSet(row)) {
        root.$dispatch('playback/play');
      } else {
        root.$dispatch('playback/play', {
          context: props.uri,
          track: row,
        });
      }
    };
    const onRowClicked = (row: OnRow['on-row-clicked']) => {
      if (root.$screen.isSingleColumn) {
        onMediaButtonClicked(row);
      }
    };

    return {
      select,
      selectItems,
      customFilter,
      headers,
      isEpisodeSet,
      isPlayingEpisode,
      onMediaButtonClicked,
      onRowClicked,
    };
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
