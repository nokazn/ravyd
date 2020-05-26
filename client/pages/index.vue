<template>
  <main :class="$style.RootPage">
    <scrollable-cards-section
      title="今週の新譜"
      :class="$style.RootPage__section">
      <release-card
        v-for="release in newReleaseList"
        :key="release.id"
        v-bind="release" />
    </scrollable-cards-section>

    <scrollable-cards-section
      title="お気に入りのトラック"
      :class="$style.RootPage__section">
      <release-card
        v-for="release in topTrackList"
        :key="release.id"
        v-bind="release" />
    </scrollable-cards-section>

    <scrollable-cards-section
      title="お気に入りのアーティスト"
      :class="$style.RootPage__section">
      <artist-card
        v-for="artist in topArtistList"
        :key="artist.id"
        v-bind="artist" />
    </scrollable-cards-section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';

import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard, { ReleaseCardInfo } from '~/components/containers/card/ReleaseCard.vue';
import ArtistCard, { ArtistCardInfo } from '~/components/containers/card/ArtistCard.vue';
import { parseTrackForCard } from '~/scripts/parser/parseTrackForCard';
import { parseArtistForCard } from '~/scripts/parser/parseArtistForCard';
import { parseReleaseForCard } from '~/scripts/parser/parseReleaseForCard';

export type AsyncData = {
  topArtistList: ArtistCardInfo[] | undefined
  topTrackList: ReleaseCardInfo[] | undefined
  newReleaseList: ReleaseCardInfo[] | undefined
}

export default Vue.extend({
  components: {
    ScrollableCardsSection,
    ReleaseCard,
    ArtistCard,
  },

  async asyncData({ app }): Promise<AsyncData> {
    const country = app.$state().auth.userData?.country;
    const [topArtists, topTracks, newReleases] = await Promise.all([
      app.$spotify.top.getTopArtists({}),
      app.$spotify.top.getTopTracks({}),
      app.$spotify.browse.getNewReleases({ country }),
    ]);
    const cardImageSize = 160;
    const topArtistList = topArtists?.items.map(parseArtistForCard(cardImageSize));
    const topTrackList = topTracks?.items.map(parseTrackForCard(cardImageSize));
    const newReleaseList = newReleases?.albums?.items.map(parseReleaseForCard(cardImageSize));

    app.$commit('SET_DOMINANT_BACKGROUND_COLOR', undefined);

    return {
      topArtistList,
      topTrackList,
      newReleaseList,
    };
  },

  head() {
    return {
      title: 'ホーム',
    };
  },
});
</script>

<style lang="scss" module>
.RootPage {
  padding: 16px 0 48px;
  &__section:not(:last-child) {
    margin-bottom: 40px;
  }
}
</style>
