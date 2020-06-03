<template>
  <div :class="$style.RootPage">
    <ScrollableCardsSection
      title="今週の新譜"
      :class="$style.RootPage__section"
    >
      <ReleaseCard
        v-for="release in newReleaseList"
        :key="release.id"
        v-bind="release"
        :width="cardWidth"
      />
    </ScrollableCardsSection>

    <ScrollableCardsSection
      title="お気に入りのトラック"
      :class="$style.RootPage__section"
    >
      <ReleaseCard
        v-for="release in topTrackList"
        :key="release.id"
        v-bind="release"
        :width="cardWidth"
      />
    </ScrollableCardsSection>

    <ScrollableCardsSection
      title="お気に入りのアーティスト"
      :class="$style.RootPage__section"
    >
      <ArtistCard
        v-for="artist in topArtistList"
        :key="artist.id"
        v-bind="artist"
        :width="cardWidth"
      />
    </ScrollableCardsSection>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard, { ReleaseCardInfo } from '~/components/containers/card/ReleaseCard.vue';
import ArtistCard, { ArtistCardInfo } from '~/components/containers/card/ArtistCard.vue';
import { convertTrackForCard } from '~/scripts/converter/convertTrackForCard';
import { convertArtistForCard } from '~/scripts/converter/convertArtistForCard';
import { convertReleaseForCard } from '~/scripts/converter/convertReleaseForCard';

export type AsyncData = {
  cardWidth: number
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
    const country = app.$getters()['auth/userCountryCode'];
    const [topArtists, topTracks, newReleases] = await Promise.all([
      app.$spotify.top.getTopArtists({}),
      app.$spotify.top.getTopTracks({}),
      app.$spotify.browse.getNewReleases({ country }),
    ]);
    const cardWidth = 180;
    const topArtistList = topArtists?.items.map(convertArtistForCard(cardWidth));
    const topTrackList = topTracks?.items.map(convertTrackForCard(cardWidth));
    const newReleaseList = newReleases?.albums?.items.map(convertReleaseForCard(cardWidth));

    app.$commit('SET_DOMINANT_BACKGROUND_COLOR', undefined);

    return {
      cardWidth,
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
