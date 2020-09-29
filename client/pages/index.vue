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
          :width="$window.cardWidth"
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
        :width="$window.cardWidth"
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
        :width="$window.cardWidth"
      />
    </ScrollableCardsSection>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import {
  convertTrackForCard,
  convertArtistForCard,
  convertReleaseForCard,
} from '~/utils/converter';
import { App } from '~~/types';

export type AsyncData = {
  topArtistList: App.ArtistCardInfo[] | undefined
  topTrackList: App.ReleaseCardInfo[] | undefined
  newReleaseList: App.ReleaseCardInfo[] | undefined
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
    ] as const);
    const topArtistList = topArtists?.items.map(convertArtistForCard);
    const topTrackList = topTracks?.items.map(convertTrackForCard);
    const newReleaseList = newReleases?.albums?.items.map(convertReleaseForCard);

    app.$commit('SET_DOMINANT_BACKGROUND_COLOR', undefined);

    return {
      topArtistList,
      topTrackList,
      newReleaseList,
    };
  },

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
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
  @include page-margin($g-gradation-width);

  &__section {
    margin-bottom: 32px;
  }
}
</style>
