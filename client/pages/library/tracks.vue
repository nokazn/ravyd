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
import { getUserSavedTracks } from '~/scripts/localPlugins/library/tracks';
import { App } from '~~/types';

interface AsyncData {
  trackList: App.PlaylistTrackDetail[] | null
}

@Component({
  components: {
    Page,
    PlaylistTrackTable,
  },

  async asyncData(context): Promise<AsyncData> {
    const trackList = await getUserSavedTracks(context);
    return {
      trackList,
    };
  },

  head() {
    return {
      title: 'お気に入りの曲',
    };
  },
})
export default class LibraryTracksPage extends Vue implements AsyncData {
  trackList: App.PlaylistTrackDetail[] | null = null;
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
