<template>
  <div :class="$style.LibraryTracksPage">
    <h1
      :class="$style.LibraryTracksPage__title"
      v-text="title"
    />

    <PlaylistTrackTable
      v-if="trackList != null"
      :track-list="trackList"
      uri=""
      :class="$style.LibraryTracksPage__table"
    />

    <IntersectionLoadingCircle
      :is-loading="!isFullTrackList"
      @on-appeared="onLoadingCircleAppear"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import PlaylistTrackTable from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
}

const LIMIT_OF_TRACKS = 30 as const;

@Component({
  components: {
    PlaylistTrackTable,
    IntersectionLoadingCircle,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/tracks/trackListLength'] === 0) {
      await app.$dispatch('library/tracks/getSavedTrackList', { limit: LIMIT_OF_TRACKS });
    } else {
      await app.$dispatch('library/tracks/updateLatestSavedTrackList');
    }
    app.$dispatch('library/tracks/removeUnsavedTracks');
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined
  title = 'お気に入りの曲'

  get trackList(): App.PlaylistTrackDetail[] | null {
    return this.$state().library.tracks.trackList;
  }
  get isFullTrackList(): boolean {
    return this.$state().library.tracks.isFullTrackList;
  }

  head() {
    return {
      title: this.title,
    };
  }

  onLoadingCircleAppear() {
    this.$dispatch('library/tracks/getSavedTrackList');
  }
}
</script>

<style lang="scss" module>
.LibraryTracksPage {
  padding: 16px 3% 48px;
  & > * {
    margin-bottom: 16px;
  }
  &__table {
    width: calc((100vw - #{g-navigation-drawer-width}) * 0.94);
  }
  &__loading {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
