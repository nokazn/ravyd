<template>
  <Page>
    <div :class="$style.LibraryTracksPage">
      <h2>お気に入りの曲</h2>
      <PlaylistTrackTable
        :track-list="trackList"
        uri=""
      />
    </div>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import Page from '~/components/globals/Page.vue';
import PlaylistTrackTable from '~/components/containers/table/PlaylistTrackTable.vue';
import { App } from '~~/types';

interface AsyncData {
  trackList: App.PlaylistTrackDetail[] | null
}

@Component({
  components: {
    Page,
    PlaylistTrackTable,
  },

  async fetch({ app }): Promise<void> {
    await app.$dispatch('library/getSavedTrackList');
  },

  head() {
    return {
      title: 'お気に入りの曲',
    };
  },
})
export default class LibraryTracksPage extends Vue implements AsyncData {
  get trackList(): App.PlaylistTrackDetail[] | null {
    return this.$state().library.trackList;
  }
}
</script>

<style lang="scss" module>
.LibraryTracksPage {
  padding: 16px 2% 48px;
  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
