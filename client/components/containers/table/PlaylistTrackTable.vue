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

import PlaylistTrackTableRow, { On as OnRow } from '~/components/parts/table/PlaylistTrackTableRow.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  activeRowId: string | null
};

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: App.PlaylistTrackDetail
}

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
      type: String as PropType<string | undefined>,
      default: undefined,
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
    setCustomContext(trackUriList: string[]) {
      this.$dispatch('player/setCustomContext', {
        contextUri: this.uri,
        trackUriList,
      });
    },
    onMediaButtonClicked({ index, id, uri }: OnRow['on-media-button-clicked']) {
      if (this.isPlayingTrack(id)) {
        this.$dispatch('player/pause');
        return;
      }

      // trackUriList は更新されうる
      const trackUriList = this.trackList.map((track) => track.uri);
      // プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
      this.$dispatch('player/play', this.uri != null
        ? {
          contextUri: this.uri,
          offset: { position: index },
        }
        : {
          trackUriList,
          offset: { uri },
        });

      this.setCustomContext(trackUriList);
    },
    onFavoriteButtonClicked(row: OnRow['on-favorite-button-clicked']) {
      const nextSavedState = !row.isSaved;

      const params: On['on-favorite-button-clicked'] = row;
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, params);

      if (nextSavedState) {
        this.$dispatch('library/tracks/saveTracks', [row.id]);
      } else {
        this.$dispatch('library/tracks/removeTracks', [row.id]);
      }
    },
    onRowClicked({ id }: OnRow['on-row-clicked']) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss" module>
.PlaylistTrackTable {
  // 表の背景を透過にする
  background-color: rgba(0, 0, 0, 0) !important;

  table {
    // 表と列の幅を最初の行のセルの幅に固定して設定
    table-layout: fixed;

    tr {
      td,
      th {
        padding: 0 8px;
      }
    }
  }
}

</style>
