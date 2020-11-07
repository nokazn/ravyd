<template>
  <v-data-table
    disable-pagination
    hide-default-footer
    :headers="headers"
    :items="tracks"
    :mobile-breakpoint="0"
    :no-data-text="noDataText"
    class="playlist-track-table"
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
        :hide-image="hideImage"
        :collaborative="collaborative"
        :hide-added-at="hideAddedAt"
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
import type { DataTableHeader } from 'vuetify';

import PlaylistTrackTableRow, { On as OnRow } from '~/components/parts/table/PlaylistTrackTableRow.vue';
import type { App } from '~~/types';

const ON_FAVORITE_BUTTON_CLICKED = 'on-favorite-button-clicked';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnRow['on-favorite-button-clicked']
}

export default Vue.extend({
  components: {
    PlaylistTrackTableRow,
  },

  props: {
    tracks: {
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
    hideImage: {
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

  computed: {
    // マウント後に変化するのは $screen だけで、他の prop はキャッシュする必要なし
    headers(): DataTableHeader[] {
      // width は 左右の padding を含めた幅
      const totalSidePadding = 12;
      const buttonColumnWidth = (n: number = 1) => {
        const buttonSize = this.$screen.isSingleColumn
          ? this.$constant.DEFAULT_BUTTON_SIZE_MOBILE
          : this.$constant.DEFAULT_BUTTON_SIZE;
        return totalSidePadding + buttonSize * n + 2 * (n - 1);
      };
      const imageColumn = {
        text: '',
        value: 'images',
        width: this.$constant.PLAYLIST_TRACK_TABLE_ARTWORK_SIZE + totalSidePadding,
        sortable: false,
        filterable: false,
      };
      const mediaColumn = {
        text: '',
        value: 'media',
        width: buttonColumnWidth(1),
        sortable: false,
        filterable: false,
      };
      const isSavedColumn = {
        text: '',
        value: 'isSaved',
        width: buttonColumnWidth(1),
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

      let headers: (DataTableHeader | undefined)[];
      if (this.$screen.isSingleColumn) {
        headers = [
          // hideImage が指定されれば非表示
          this.hideImage ? undefined : imageColumn,
          titleColumn,
          menuColumn,
        ];
      } else {
        headers = [
          // hideImage が指定されれば非表示
          this.hideImage ? undefined : imageColumn,
          mediaColumn,
          isSavedColumn,
          titleColumn,
          // collaborative が指定されれば表示
          this.collaborative ? addedByColumn : undefined,
          // hideImage が指定されれば非表示
          this.hideAddedAt ? undefined : addedAtColumn,
          durationColumn,
          menuColumn,
        ];
      }
      // @as addedAt, addedBy が有効かどうかで分け、undefined を除く
      return headers.filter((header) => header != null) as DataTableHeader[];
    },
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
    onMediaButtonClicked(row: OnRow['on-media-button-clicked']) {
      // @todo エピソードは isPlayable が false でも再生できるようにしている
      if (row.type !== 'episode' && row.isPlayable === false) return;

      if (this.isPlayingTrack(row.id)) {
        this.$dispatch('playback/pause');
        return;
      }

      if (this.isTrackSet(row.id)) {
        this.$dispatch('playback/play');
        return;
      }
      // trackUriList は更新されうる
      const trackUriList = this.tracks.map((track) => track.uri);
      // @todo プレイリスト再生の際は offset を uri で指定すると、403 が返る場合がある?
      // ライブラリのお気に入りの曲を再生する場合は contextUri では指定できないので、trackUriList を指定
      this.$dispatch('playback/play', !this.custom && this.uri != null
        ? {
          contextUri: this.uri,
          offset: { uri: row.uri },
          // offset: { position: row.index },
        }
        : {
          trackUriList,
          offset: { uri: row.uri },
        });
      this.setCustomContext(trackUriList, row.index);
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
.playlist-track-table {
  @include v-data-table-height(64px);
}
</style>
