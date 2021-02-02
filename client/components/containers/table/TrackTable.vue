<template>
  <v-data-table
    disable-pagination
    disable-sort
    hide-default-footer
    :headers="headers"
    :items="tracks"
    :mobile-breakpoint="0"
    group-by="discNumber"
    no-data-text="トラックがありません。"
    class="track-table"
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
        :active="item.id === activeRowId"
        :set="isTrackSet(item.id)"
        :playing="isPlayingTrack(item.id)"
        @on-row-clicked="onRowClicked"
        @on-media-button-clicked="onMediaButtonClicked"
        @on-favorite-button-clicked="onFavoriteButtonClicked"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { DataTableHeader } from 'vuetify';
import TrackTableRow, { ON_FAVORITE_BUTTON_CLICKED, On as OnRow } from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import { useButtonSize } from '~/use/style';
import { getQuery } from '~/utils/text';
import type { App } from '~~/types';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnRow['on-favorite-button-clicked']
}

export default defineComponent({
  components: {
    TrackTableRow,
    TrackTableGroupHeader,
  },

  props: {
    tracks: {
      type: Array as PropType<App.TrackDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },

  setup(props, { root, emit }) {
    const trackId = getQuery(root.$route.query, 'track');
    const activeRowId = trackId != null
      ? props.tracks.find((item) => item.id === trackId)?.id
      : undefined;
    const isActiveRow = (id: string) => activeRowId === id;

    const headers = computed<DataTableHeader[]>(() => {
      const buttonColumnWidth = (n: number = 1) => {
        const sidePadding = 12;
        const buttonSize = useButtonSize(root);
        return sidePadding + buttonSize.value * n + 2 * (n - 1);
      };
      const indexColumn = {
        text: '#',
        value: 'index',
        width: 48,
        align: 'center' as const,
      };
      const isSavedColumn = {
        text: '',
        value: 'isSaved',
        width: buttonColumnWidth(),
        align: 'center' as const,
        sortable: false,
        filterable: false,
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
        width: buttonColumnWidth(root.$screen.isSingleColumn ? 2 : 1),
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };
      return root.$screen.isSingleColumn
        ? [nameColumn, menuColumn]
        : [indexColumn, isSavedColumn, nameColumn, durationColumn, menuColumn];
    });
    const hasMultipleDiscs = computed<boolean>(() => {
      const discNumberList = props.tracks.reduce<number[]>((prev, curr) => {
        const lastIndex = prev.length - 1;
        if (lastIndex < 0 || prev[lastIndex] !== curr.discNumber) {
          prev.push(curr.discNumber);
        }
        return prev;
      }, []);
      // 連番でない場合はグループ表示しない
      return discNumberList.length > 1
        ? discNumberList.every((n, i) => n === i + 1)
        : false;
    });

    const isTrackSet = (id: string | undefined) => root.$getters()['playback/isTrackSet'](id);
    const isPlayingTrack = (id: string) => isTrackSet(id) && root.$state().playback.isPlaying;
    const onMediaButtonClicked = (row: OnRow['on-media-button-clicked']) => {
      if (isPlayingTrack(row.id)) {
        root.$dispatch('playback/pause');
      // TODO: relinked track を参照する必要性
      } else if (isTrackSet(row.id) || isTrackSet(row.linkedFrom?.id)) {
        root.$dispatch('playback/play');
      } else {
        root.$dispatch('playback/play', {
          contextUri: props.uri,
          // TODO:
          offset: row.linkedFrom != null
            ? { position: row.index }
            : { uri: row.uri },
        });
      }
    };
    const onFavoriteButtonClicked = (row: OnRow['on-favorite-button-clicked']) => {
      emit(ON_FAVORITE_BUTTON_CLICKED, row);
    };
    const onRowClicked = (row: OnRow['on-row-clicked']) => {
      if (root.$screen.isSingleColumn) {
        onMediaButtonClicked(row);
      }
    };

    return {
      activeRowId,
      isActiveRow,
      headers,
      hasMultipleDiscs,
      isTrackSet,
      isPlayingTrack,
      onMediaButtonClicked,
      onFavoriteButtonClicked,
      onRowClicked,
    };
  },
});
</script>

<style lang="scss">
.track-table {
  @include smaller-than-md() {
    @include v-data-table-height(56px);
  }

  @include larger-than-md() {
    @include v-data-table-height(44px);
  }
}
</style>
