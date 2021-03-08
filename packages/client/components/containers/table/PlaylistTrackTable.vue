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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { DataTableHeader } from 'vuetify';
import PlaylistTrackTableRow, { ON_FAVORITE_BUTTON_CLICKED, On as OnRow } from '~/components/parts/table/PlaylistTrackTableRow.vue';
import { useButtonSize } from '~/use/style';
import type { App } from '~/entities';

export type On = {
  [ON_FAVORITE_BUTTON_CLICKED]: OnRow['on-favorite-button-clicked']
}

export default defineComponent({
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
    collaborative: {
      type: Boolean,
      default: false,
    },
    hideAddedAt: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { root, emit }) {
    // マウント後に変化するのは $screen だけで、他の prop はキャッシュする必要なし
    const headers = computed<DataTableHeader[]>(() => {
      // width は 左右の padding を含めた幅
      const sidePadding = 12;
      const buttonColumnWidth = (n: number = 1) => {
        const buttonSize = useButtonSize(root).value;
        return sidePadding + buttonSize * n + 2 * (n - 1);
      };
      const imageColumn = {
        text: '',
        value: 'images',
        width: root.$constant.PLAYLIST_TRACK_TABLE_ARTWORK_SIZE + sidePadding,
        sortable: false,
        filterable: false,
        align: 'center' as const,
      };
      const mediaColumn = {
        text: '',
        value: 'media',
        width: buttonColumnWidth(1),
        sortable: false,
        filterable: false,
        align: 'center' as const,
      };
      const isSavedColumn = {
        text: '',
        value: 'isSaved',
        width: buttonColumnWidth(1),
        sortable: false,
        filterable: false,
        align: 'center' as const,
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
        width: buttonColumnWidth(root.$screen.isSingleColumn ? 2 : 1),
        align: 'center' as const,
        sortable: false,
        filterable: false,
      };

      if (root.$screen.isSingleColumn) {
        return [
          imageColumn,
          titleColumn,
          menuColumn,
        ];
      }
      //  collaborative, addedAt が有効かどうかで分け、undefined を除く
      return [
        imageColumn,
        mediaColumn,
        isSavedColumn,
        titleColumn,
        props.collaborative ? addedByColumn : undefined,
        props.hideAddedAt ? undefined : addedAtColumn,
        durationColumn,
        menuColumn,
      ].filter((header) => header != null) as DataTableHeader[];
    });
    const isTrackSet = (id: string) => {
      return root.$getters()['playback/isContextSet'](props.uri)
        && root.$getters()['playback/isTrackSet'](id);
    };
    const isPlayingTrack = (id: string) => {
      return isTrackSet(id) && root.$state().playback.isPlaying;
    };

    const onMediaButtonClicked = (row: OnRow['on-media-button-clicked']) => {
      // TODO: エピソードは isPlayable が false でも再生できるようにしている
      if (row.type !== 'episode' && row.isPlayable === false) return;

      if (isPlayingTrack(row.id)) {
        root.$dispatch('playback/pause');
        return;
      }
      if (isTrackSet(row.id)) {
        root.$dispatch('playback/play');
        return;
      }
      // trackUriList は更新されうるので都度算出する
      const trackUriList = props.tracks.map((track) => track.uri);
      // history と collection は contextUri では指定できないので、trackUriList を指定
      root.$dispatch('playback/play', props.custom || props.uri == null
        ? {
          trackUriList,
          offset: {
            // position: row.index,
            uri: row.uri,
          },
        }
        : {
          contextUri: props.uri,
          // TODO: #552 offset を uri で指定すると、403 が返る場合がある?
          offset: {
            // position: row.index,
            uri: row.uri,
          },
        });
      root.$dispatch('playback/setCustomContext', {
        contextUri: props.uri,
        trackUriList,
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
      headers,
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
.playlist-track-table {
  @include v-data-table-height(64px);
}
</style>
