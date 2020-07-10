<template>
  <v-data-table
    :headers="headers"
    :items="trackList"
    disable-pagination
    hide-default-footer
    :no-data-text="noDataText"
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
        :playlist-id="playlistId"
        :added-at="addedAt"
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
  activeRowId: string | undefined
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
    addedAt: {
      type: Boolean,
      default: true,
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
    const addedAtColumn = {
      text: '',
      value: 'addedAt',
      width: 72,
      align: 'center' as const,
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

    // addedAt が有効かどうか
    const headers = this.addedAt
      ? [
        isSavedColumn,
        titleColumn,
        addedAtColumn,
        durationColumn,
        menuColumn,
      ]
      : [
        isSavedColumn,
        titleColumn,
        durationColumn,
        menuColumn,
      ];

    return {
      headers,
      activeRowId: undefined,
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

      if (this.isTrackSet(id)) {
        this.$dispatch('player/play');
        return;
      }

      // trackUriList は更新されうる
      const trackUriList = this.trackList.map((track) => track.uri);
      // プレイリスト再生の際 position を uri で指定すると、403 が返る場合があるので index で指定
      this.$dispatch('player/play', !this.custom && this.uri != null
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
    // row をコピーしたものを参照する
    onFavoriteButtonClicked({ ...row }: OnRow['on-favorite-button-clicked']) {
      this.$emit(ON_FAVORITE_BUTTON_CLICKED, row);
    },
    onRowClicked({ id }: OnRow['on-row-clicked']) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss" module>
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
    }
  }
}

</style>
