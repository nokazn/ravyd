<template>
  <div :class="$style.RootPage">
    <ScrollableCardsSection
      title="今週の新譜"
      :class="$style.RootPage__section"
    >
      <template v-if="newReleaseList != null">
        <ReleaseCard
          v-for="release in newReleaseList"
          :key="release.id"
          v-bind="release"
          :width="CARD_WIDTH"
        />
      </template>
    </ScrollableCardsSection>

    <ScrollableCardsSection
      title="お気に入りのトラック"
      :class="$style.RootPage__section"
    >
      <ReleaseCard
        v-for="release in topTrackList"
        :key="release.id"
        v-bind="release"
        :width="CARD_WIDTH"
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
        :width="CARD_WIDTH"
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

const CARD_WIDTH = 200;

export type AsyncData = {
  CARD_WIDTH: number
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
    const topArtistList = topArtists?.items.map(convertArtistForCard(CARD_WIDTH));
    const topTrackList = topTracks?.items.map(convertTrackForCard(CARD_WIDTH));
    const newReleaseList = newReleases?.albums?.items.map(convertReleaseForCard(CARD_WIDTH));

    app.$commit('SET_DOMINANT_BACKGROUND_COLOR', undefined);

    return {
      CARD_WIDTH,
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
