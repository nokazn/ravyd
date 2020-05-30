<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-pagination
    hide-default-footer
    class="track-list-table"
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
        :is-active="isActiveRow(item.id)"
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

import PlaylistTrackTableRow from '~/components/parts/table/PlaylistTrackTableRow.vue';
import { App } from '~~/types';

export type Data = {
  headers: DataTableHeader[]
  items: App.PlaylistTrackDetail[]
  activeRowId: string | undefined
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
        value: 'index',
        width: 48,
        align: 'center' as const,
      },
      {
        text: '',
        value: 'isSaved',
        width: 48,
        align: 'center' as const,
      },
      {
        text: 'タイトル',
        value: 'name',
      },
      {
        text: 'アルバム',
        value: 'releaseName',
      },
      {
        text: '',
        value: 'explicit',
        width: 60,
        align: 'center' as const,
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
        width: 48,
        align: 'center' as const,
      },
    ];
    const items = this.trackList;

    const hash = this.$route.hash.replace('#', '');
    const activeRowId = items.find((item) => item.hash === hash)?.id;

    return {
      headers,
      items,
      activeRowId,
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
    isActiveRow(): (id: string) => boolean {
      return (id: string) => this.activeRowId === id;
    },
  },

  methods: {
    onMediaButtonClicked(row: App.PlaylistTrackDetail) {
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
    async onFavoriteButtonClicked(row: App.PlaylistTrackDetail) {
      const nextSavedState = !row.isSaved;
      const modifySavedState = (isSaved: boolean, index: number) => this.items
        .map((item, i) => (i === index
          ? { ...item, isSaved }
          : item));

      // API との通信の結果を待たずに先に表示を変更させておく
      this.items = modifySavedState(nextSavedState, row.index);
      if (nextSavedState) {
        await this.$dispatch('library/saveTracks', [row.id]);
      } else {
        await this.$dispatch('library/removeTracks', [row.id]);
      }

      const [isSaved] = await this.$spotify.library.checkUserSavedTracks({
        trackIdList: [row.id],
      });
      // 実際の状態と異なれば戻す
      if (isSaved !== nextSavedState) this.items = modifySavedState(isSaved, row.index);
    },
    onRowClicked({ id }: App.PlaylistTrackDetail) {
      this.activeRowId = id;
    },
  },
});
</script>

<style lang="scss">
.track-list-table {
  td, th {
    // 列の幅をデフォルトの 48px から少し狭める
    height: 44px!important;
  }
}

.v-data-table {
  // 表の背景を透過にする
  background-color: rgba(0, 0, 0, 0)!important;
}
</style>
