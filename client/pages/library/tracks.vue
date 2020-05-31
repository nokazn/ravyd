<template>
  <Page>
    <div :class="$style.LibraryTracksPage">
      <h1 :class="$style.LibraryTracksPage__title">
        お気に入りの曲
      </h1>

      <PlaylistTrackTable
        v-if="trackList != null"
        :track-list="trackList"
        uri=""
        :class="$style.LibraryTracksPage__table"
      />

      <div
        ref="libraryTracksPageBottom"
        :class="$style.LibraryTracksPage__loading"
      >
        <v-progress-circular
          v-if="!isFullTrackList"
          indeterminate
        />
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import Page from '~/components/globals/Page.vue';
import PlaylistTrackTable from '~/components/containers/table/PlaylistTrackTable.vue';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
}

const TRACK_LIMIT = 30 as const;

@Component({
  components: {
    Page,
    PlaylistTrackTable,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/trackListLength'] === 0) {
      await app.$dispatch('library/getSavedTrackList', { limit: TRACK_LIMIT });
    } else {
      await app.$dispatch('library/updateLatestSavedTrackList');
    }
    app.$dispatch('library/removeUnsavedTracks');
  },

  head() {
    return {
      title: 'お気に入りの曲',
    };
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined

  get trackList(): App.PlaylistTrackDetail[] | null {
    return this.$state().library.trackList;
  }
  get isFullTrackList(): boolean {
    return this.$state().library.isFullTrackList;
  }

  mounted() {
    const bottomElement = this.$refs.libraryTracksPageBottom as HTMLDivElement;

    // loading が表示されたら新たに読み込む
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$dispatch('library/getSavedTrackList');
        }
      });
    });
    this.observer.observe(bottomElement);
  }

  beforeDestroy() {
    if (this.observer != null) this.observer.disconnect();
    this.$dispatch('library/removeUnsavedTracks');
  }
}
</script>

<style lang="scss" module>
.LibraryTracksPage {
  padding: 16px 3% 48px;
  & > * {
    margin-bottom: 24px;
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
