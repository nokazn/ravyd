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
        width: buttonColumnWidth(root.$screen.isMultiColumn ? 1 : 2),
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };
      return root.$screen.isMultiColumn
        ? [indexColumn, isSavedColumn, nameColumn, durationColumn, menuColumn]
        : [nameColumn, menuColumn];
    });
    // relink されたトラックがある場合はディスクによるグループ表示は行わない
    const hasMultipleDiscs = computed<boolean>(() => {
      const relinkedTrack = props.tracks.find((track) => track.linkedFrom != null);
      const discNumberList = Array.from(new Set(props.tracks.map((track) => track.discNumber)));
      return relinkedTrack != null
        ? false
        : discNumberList.length > 1;
    });

    const isTrackSet = (id: string) => root.$getters()['playback/isTrackSet'](id);
    const isPlayingTrack = (id: string) => isTrackSet(id) && root.$state().playback.isPlaying;
    const onMediaButtonClicked = (row: OnRow['on-media-button-clicked']) => {
      if (isPlayingTrack(row.id)) {
        root.$dispatch('playback/pause');
        return;
      }
      root.$dispatch('playback/play', {
        contextUri: props.uri,
        offset: row.linkedFrom != null
          ? { position: row.index }
          : { uri: row.uri },
      });
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
