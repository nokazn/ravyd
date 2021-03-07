<template>
  <div
    v-if="hasContent"
    :class="$style.RootPage"
  >
    <ScrollableCardsSection
      v-if="newReleaseList.length > 0"
      title="今週の新譜"
      :class="$style.RootPage__section"
    >
      <ReleaseCard
        v-for="release in newReleaseList"
        :key="release.id"
        :item="release"
        :width="$screen.cardWidth"
      />
    </ScrollableCardsSection>

    <ScrollableCardsSection
      v-if="topTrackList.length > 0"
      title="お気に入りのトラック"
      :class="$style.RootPage__section"
    >
      <ReleaseCard
        v-for="release in topTrackList"
        :key="release.id"
        :item="release"
        :width="$screen.cardWidth"
      />
    </ScrollableCardsSection>

    <ScrollableCardsSection
      v-if="topArtistList.length > 0"
      title="お気に入りのアーティスト"
      :class="$style.RootPage__section"
    >
      <ArtistCard
        v-for="artist in topArtistList"
        :key="artist.id"
        :item="artist"
        :width="$screen.cardWidth"
      />
    </ScrollableCardsSection>
  </div>

  <Fallback v-else>
    トップページを読み込めませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import type { SpotifyAPI } from 'shared/types';
import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';
import { convertTrackForCard, convertReleaseForCard } from '~/services/converter';
import type { App } from '~/entities';


type AsyncData = {
  topArtistList: SpotifyAPI.Artist[];
  topTrackList: App.ReleaseCard<'track'>[];
  newReleaseList: App.ReleaseCard<'album'>[];
}

@Component({
  components: {
    ScrollableCardsSection,
    ReleaseCard,
    ArtistCard,
    Fallback,
  },

  async asyncData({ app }): Promise<AsyncData> {
    const [topArtists, topTracks, newReleases] = await Promise.all([
      app.$spotify.top.getTopArtists({}),
      app.$spotify.top.getTopTracks({}),
      app.$spotify.browse.getNewReleases({}),
    ] as const);

    const topArtistList = topArtists?.items ?? [];
    const topTrackList = topTracks?.items.map(convertTrackForCard) ?? [];
    const newReleaseList = newReleases.albums?.items.map(convertReleaseForCard) ?? [];
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
})
export default class RootPage extends Vue implements AsyncData {
  topArtistList: SpotifyAPI.Artist[] = [];
  topTrackList: App.ReleaseCard<'track'>[] = [];
  newReleaseList: App.ReleaseCard<'album'>[] = [];

  get hasContent(): boolean {
    return this.topArtistList.length > 0
      || this.topTrackList.length > 0
      || this.newReleaseList.length > 0;
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }
}
</script>

<style lang="scss" module>
.RootPage {
  @include page-margin();

  &__section {
    margin-bottom: 32px;
  }
}
</style>
