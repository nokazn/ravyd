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
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import TrackTableRow, { On as OnRow } from '~/components/parts/table/TrackTableRow.vue';
import TrackTableGroupHeader from '~/components/parts/table/TrackTableGroupHeader.vue';
import { getQuery } from '~/utils/text';
import { App } from '~~/types';

type Data = {
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
    tracks: {
      type: Array as PropType<App.TrackDetail[]>,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
  },

  data(): Data {
    const trackId = getQuery(this.$route.query, 'track');
    const activeRowId = trackId != null
      ? this.tracks.find((item) => item.id === trackId)?.id
      : undefined;

    return {
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
    headers(): DataTableHeader[] {
      // width は 左右の padding を含めた幅
      const buttonColumnWidth = (n: number = 1) => {
        const totalSidePadding = 12;
        const buttonSize = this.$screen.isSingleColumn
          ? this.$constant.DEFAULT_BUTTON_SIZE_MOBILE
          : this.$constant.DEFAULT_BUTTON_SIZE;
        return totalSidePadding + buttonSize * n + 2 * (n - 1);
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
        width: buttonColumnWidth(1),
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
        width: buttonColumnWidth(this.$screen.isMultiColumn ? 1 : 2),
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };
      return this.$screen.isMultiColumn
        ? [indexColumn, isSavedColumn, nameColumn, durationColumn, menuColumn]
        : [nameColumn, menuColumn];
    },
    // relink されたトラックがある場合はディスクによるグループ表示は行わない
    hasMultipleDiscs(): boolean {
      const { tracks } = this;
      const relinkedTrack = tracks.find((track) => track.linkedFrom != null);
      const discNumberList = Array.from(new Set(tracks
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

      if (row.isPlayable) {
        const offset = row.linkedFrom != null
          ? { position: row.index }
          : { uri: row.uri };

        this.$dispatch('playback/play', {
          contextUri: this.uri,
          offset,
        });
      }
    },
    onFavoriteButtonClicked(row: OnRow['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
    onRowClicked(row: OnRow['on-row-clicked']) {
      if (this.$screen.isSingleColumn) {
        this.onMediaButtonClicked(row);
      }
    },
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
