<template>
  <main :class="$style.RootPage">
    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        今週の新譜
      </h2>
      <v-divider :class="$style.Divider" />
      <scrollable-cards-wrapper :class="$style.RootPage__cardContainer">
        <release-card
          v-for="release in newReleaseList"
          :key="release.id"
          v-bind="release" />
      </scrollable-cards-wrapper>
    </section>


    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        お気に入りのトラック
      </h2>
      <v-divider :class="$style.Divider" />
      <scrollable-cards-wrapper :class="$style.RootPage__cardContainer">
        <release-card
          v-for="track in topTrackList"
          :key="track.id"
          v-bind="track" />
      </scrollable-cards-wrapper>
    </section>


    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        お気に入りのアーティスト
      </h2>
      <v-divider :class="$style.Divider" />
      <scrollable-cards-wrapper :class="$style.RootPage__cardContainer">
        <artist-card
          v-for="artist in topArtistList"
          :key="artist.id"
          v-bind="artist" />
      </scrollable-cards-wrapper>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';

import ScrollableCardsWrapper from '~/components/parts/wrapper/ScrollableCardsWrapper.vue';
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
    ScrollableCardsWrapper,
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
  padding: 12px 0 48px;
  &__section:not(:last-child) {
    margin-bottom: 40px;
  }
  &__title {
    margin: {
      left: 40px;
      bottom: 6px;
    }
  }

  .Divider {
    margin: 0 40px 16px;
  }
}
</style>
