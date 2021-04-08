<template>
  <div :class="$style.LibraryHistoryPage">
    <PlaylistTrackTable
      v-if="trackList != null"
      custom
      hide-added-at
      :tracks="trackList"
      :uri="uri"
      :class="$style.LibraryHistoryPage__table"
      @on-favorite-button-clicked="onFavoriteButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { generateUserContextUri } from '~/services/converter';
import type { App } from '~/entities';

interface AsyncData {
  uri: string | undefined;
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined;
}

@Component({
  components: {
    PlaylistTrackTable,
    IntersectionLoadingCircle,
  },

  async fetch({ app }) {
    await app.$dispatch('library/history/getRecentlyPlayed');
  },

  async asyncData({ app }) {
    return {
      uri: generateUserContextUri(app.$getters()['auth/userId'], 'history'),
    };
  },

  head() {
    return {
      title: '最近再生した項目',
    };
  },
})
export default class HistoryPage extends Vue implements AsyncData, Data {
  uri: string | undefined;
  mutationUnsubscribe: (() => void) | undefined = undefined;

  get trackList(): App.PlaylistTrackDetail[] {
    return this.$getters()['library/history/historyList'];
  }

  mounted() {
    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      switch (mutation.type) {
        case 'library/tracks/INCREMENT_UNACQUIRED_TRACKS':
          this.$dispatch('library/tracks/updateLatestSavedTrackList');
          break;

        default:
          break;
      }
    });
  }

  onFavoriteButtonClicked({ id, isSaved }: OnTable['on-favorite-button-clicked']) {
    const nextIsSavedState = !isSaved;
    this.$dispatch('library/history/modifyTrackSavedState', {
      trackId: id,
      isSaved,
    });

    if (nextIsSavedState) {
      this.$dispatch('library/tracks/saveTracks', [id]);
    } else {
      this.$dispatch('library/tracks/removeTracks', [id]);
    }
  }
}
</script>

<style lang="scss" module>
.LibraryHistoryPage {
  @include page-padding(0.375);

  & > * {
    margin-bottom: 24px;
  }
}
</style>
