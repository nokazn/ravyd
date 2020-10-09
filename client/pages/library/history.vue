<template>
  <div :class="$style.LibraryHistoryPage">
    <PlaylistTrackTable
      v-if="trackList != null"
      hide-added-at
      :tracks="trackList"
      :class="$style.LibraryHistoryPage__table"
      @on-favorite-button-clicked="onFavoriteButtonClicked"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState } from 'typed-vuex';

import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface AsyncData {}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
}

@Component({
  components: {
    PlaylistTrackTable,
    IntersectionLoadingCircle,
  },
  async fetch({ app }) {
    await app.$dispatch('library/history/getRecentlyPlayed');
  },
})
export default class HistoryPage extends Vue implements AsyncData, Data {
  mutationUnsubscribe: (() => void) | undefined = undefined;

  get trackList(): RootState['library']['history']['trackHistoryList'] {
    return this.$state().library.history.trackHistoryList;
  }

  mounted() {
    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      switch (mutation.type) {
        case 'library/tracks/INCREMENT_UNUPDATED_COUNTS':
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
  & > * {
    margin-bottom: 24px;
  }
}
</style>
