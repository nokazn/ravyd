<template>
  <main :class="$style.RootPage">
    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        今週の新譜
      </h2>
      <release-card-container>
        <release-card
          v-for="release in newReleaseList"
          :key="release.name"
          v-bind="release" />
      </release-card-container>
    </section>

    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        お気に入りのトラック
      </h2>
      <release-card-container>
        <release-card
          v-for="track in topTrackList"
          :key="track.name"
          v-bind="track" />
      </release-card-container>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';

import ReleaseCardContainer from '~/components/parts/container/ReleaseCardConteiner.vue';
import ReleaseCard, { ReleaseCardInfo } from '~/components/containers/card/ReleaseCard.vue';
import { parseTrack } from '~/scripts/parser/parseTrack';
import { parseArtist } from '~/scripts/parser/parseArtist';
import { parseAlbum } from '~/scripts/parser/parseAlbum';

export type AsyncData = {
  topArtistList: any,
  topTrackList: ReleaseCardInfo[] | undefined
  newReleaseList: ReleaseCardInfo[] | undefined
}

export default Vue.extend({
  components: {
    ReleaseCardContainer,
    ReleaseCard,
  },

  async asyncData({ app }): Promise<AsyncData> {
    const [topArtists, topTracks, newReleases] = await Promise.all([
      app.$spotify.top.getTopArtists({}),
      app.$spotify.top.getTopTracks({}),
      app.$spotify.browse.getNewReleases({
        country: 'JP',
        limit: 20,
      }),
    ]);

    const topArtistList: {
      name: string
      id: string
      src: string
    }[] | undefined = topArtists?.items.map(parseArtist);
    const topTrackList: ReleaseCardInfo[] | undefined = topTracks?.items.map(parseTrack);
    const newReleaseList: ReleaseCardInfo[] | undefined = newReleases?.albums.items.map(parseAlbum);

    return {
      topArtistList,
      topTrackList,
      newReleaseList,
    };
  },
});
</script>

<style lang="scss" module>
.RootPage {
  padding: 16px 0;
  &__section:not(:last-child) {
    margin-bottom: 40px;
  }
  &__title {
    margin: {
      left: 32px;
      bottom: 8px;
    }
  }
}
</style>
