<template>
  <v-data-table
    :headers="headers"
    :items="trackList"
    disable-pagination
    hide-default-footer
    :class="$style.PlaylistTrackTable"
    class="PlaylistTrackTable"
  >
    <template #header.duration>
      <v-icon
        :size="16"
        color="grey"
        title="再生時間"
      >
        mdi-clock-outline
      </v-icon>
    </template>

    <template #header.addedAt>
      <v-icon
        :size="16"
        color="grey"
        title="保存した日"
      >
        mdi-calendar-outline
      </v-icon>
    </template>

    <template #item="{ item }">
      <PlaylistTrackTableRow
        :item="item"
        :is-active="item.id === activeRowId"
        :is-track-set="isTrackSet(item.id)"
        :is-playing-track="isPlayingTrack(item.id)"
        :uri="uri"
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

import PlaylistTrackTableRow, { On } from '~/components/parts/table/PlaylistTrackTableRow.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  activeRowId: string | null
};

export default Vue.extend({
  components: {
    PlaylistTrackTableRow,
  },

  props: {
    trackList: {
      type: Array as PropType<App.PlaylistTrackDetail[]>,
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
        text: '',
        value: 'isSaved',
        width: 96,
        sortable: false,
        filterable: false,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
      {
        text: '',
        value: 'addedAt',
        width: 72,
        align: 'center' as const,
      },
      {
        text: '',
        value: 'duration',
        width: 72,
        align: 'center' as const,
      },
      {
        text: '',
        value: 'menu',
        width: 60,
        align: 'center' as const,
        sortable: false,
        filterable: false,
      },
    ];

    return {
      headers,
      activeRowId: null,
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
  },

  methods: {
    onMediaButtonClicked(row: On) {
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
    onFavoriteButtonClicked(row: On) {
      const nextSavedState = !row.isSaved;
      if (nextSavedState) {
        this.$dispatch('library/tracks/saveTracks', [row.id]);
      } else {
        this.$dispatch('library/tracks/removeTracks', [row.id]);
      }
    },
    onRowClicked({ id }: On) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss" module>
.PlaylistTrackTable {
  // 表の背景を透過にする
  background-color: rgba(0, 0, 0, 0)!important;
  table {
    // 表と列の幅を最初の行のセルの幅に固定して設定
    table-layout:fixed;
    tr {
      td, th {
        padding: 0 8px;
      }
    }
  }
}

</style>
