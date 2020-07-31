<template>
  <client-only>
    <v-data-table
      :headers="headers"
      :items="trackList"
      disable-pagination
      hide-default-footer
      :no-data-text="noDataText"
      class="PlaylistTrackTable"
    >
      <template #header.addedBy>
        <v-icon
          :size="16"
          color="subtext"
          title="追加したユーザー"
        >
          mdi-account
        </v-icon>
      </template>

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
          :playlist-id="playlistId"
          :hide-added-at="hideAddedAt"
          :collaborative="collaborative"
          :is-active="item.index === activeRowIndex"
          :is-track-set="isTrackSet(item.id)"
          :is-playing-track="isPlayingTrack(item.id)"
          @on-row-clicked="onRowClicked"
          @on-media-button-clicked="onMediaButtonClicked"
          @on-favorite-button-clicked="onFavoriteButtonClicked"
        />
      </template>
    </v-data-table>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DataTableHeader } from 'vuetify';

import PlaylistTrackTableRow, { On as OnRow } from '~/components/parts/table/PlaylistTrackTableRow.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  activeRowIndex: number | undefined
};

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnRow['on-favorite-button-clicked']
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
    playlistId: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    uri: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    noDataText: {
      type: String,
      default: 'まだトラックが追加されていません。',
    },
    // customContext を使用するか (uri は指定するけど contextUri を渡したくない場合)
    custom: {
      type: Boolean,
      default: false,
    },
    collaborative: {
      type: Boolean,
      default: false,
    },
    hideAddedAt: {
      type: Boolean,
      default: false,
    },
  },

  data(): Data {
    // 左右の padding: 8px を含めた幅
    const isSavedColumn = {
      text: '',
      value: 'isSaved',
      width: 96,
      sortable: false,
      filterable: false,
    };
    const titleColumn = {
      text: 'タイトル',
      value: 'name',
    };
    const addedByColumn = {
      text: '',
      value: 'addedBy',
      width: 96,
    };
    const addedAtColumn = {
      text: '',
      value: 'addedAt',
      width: 80,
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
      width: 60,
      align: 'center' as const,
      sortable: false,
      filterable: false,
    };

    // @as addedAt, addedBy が有効かどうかで分け、undefined を除く
    const headers = [
      isSavedColumn,
      titleColumn,
      this.collaborative ? addedByColumn : undefined,
      this.hideAddedAt ? undefined : addedAtColumn,
      durationColumn,
      menuColumn,
    ].filter((header) => header != null) as DataTableHeader[];

    return {
      headers,
      activeRowIndex: undefined,
    };
  },

  computed: {
    isTrackSet(): (trackId: string) => boolean {
      return (trackId: string) => this.$getters()['playback/contextUri'] === this.uri
        && this.$getters()['playback/isTrackSet'](trackId);
    },
    isPlayingTrack(): (trackId: string) => boolean {
      return (trackId: string) => this.isTrackSet(trackId)
        && this.$state().playback.isPlaying;
    },
  },

  methods: {
    setCustomContext(trackUriList: string[], trackIndex: number) {
      this.$dispatch('playback/setCustomContext', {
        contextUri: this.uri,
        trackUriList,
        trackIndex,
      });
    },
    onMediaButtonClicked({ index, id, uri }: OnRow['on-media-button-clicked']) {
      if (this.isPlayingTrack(id)) {
        this.$dispatch('playback/pause');
        return;
      }

      if (this.isTrackSet(id)) {
        this.$dispatch('playback/play');
        return;
      }

      // trackUriList は更新されうる
      const trackUriList = this.trackList.map((track) => track.uri);
      /**
       * プレイリスト再生の際は position を uri で指定すると、403 が返る場合があるので index で指定
       * ライブラリのお気に入りの曲を再生する場合は contextUri では指定できないので、trackUriList を指定
       */
      this.$dispatch('playback/play', !this.custom && this.uri != null
        ? {
          contextUri: this.uri,
          offset: { position: index },
        }
        : {
          trackUriList,
          offset: { uri },
        });

      this.setCustomContext(trackUriList, index);
    },
    // row をコピーしたものを参照する
    onFavoriteButtonClicked({ ...row }: OnRow['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
    onRowClicked({ index }: OnRow['on-row-clicked']) {
      this.activeRowIndex = index;
    },
  },
});
</script>

<style lang="scss">
.PlaylistTrackTable {
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

      // .v-aplication .active を無効化する
      th.active {
        background-color: inherit !important;
        border-color: inherit !important;
      }
    }
  }
}
</style>
