<template>
  <div :class="$style.LibraryArtistsPage">
    <CardsWrapper
      :min-width="$window.cardWidthMinMax[0]"
      :max-width="$window.cardWidthMinMax[1]"
    >
      <ArtistCard
        v-for="artist in artistList"
        :key="artist.id"
        v-bind="artist"
        :min-width="$window.cardWidthMinMax[0]"
        :max-width="$window.cardWidthMinMax[1]"
      />
    </CardsWrapper>

    <IntersectionLoadingCircle
      :loading="!isFull"
      @appear="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, RootGetters } from 'typed-vuex';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {
  observer: IntersectionObserver | undefined
}

const LIMIT_OF_ARTISTS = 30;

@Component({
  components: {
    ArtistCard,
    CardsWrapper,
    IntersectionLoadingCircle,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/artists/artistListLength'] === 0) {
      await app.$dispatch('library/artists/getSavedArtistList', {
        limit: LIMIT_OF_ARTISTS,
      });
    } else {
      await app.$dispatch('library/artists/updateLatestSavedArtistList');
    }
  },

  head() {
    return {
      title: 'お気に入りのアーティスト',
    };
  },
})
export default class LibraryArtistsPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined;

  get artistList(): RootState['library']['artists']['artistList'] {
    return this.$state().library.artists.artistList ?? [];
  }
  get isFull(): RootGetters['library/artists/isFull'] {
    return this.$getters()['library/artists/isFull'];
  }

  onLoadingCircleAppeared() {
    this.$dispatch('library/artists/getSavedArtistList', {
      limit: LIMIT_OF_ARTISTS,
    });
  }
}
</script>

<style lang="scss" module>
.LibraryArtistsPage {
  & > * {
    margin-bottom: 24px;
  }
}
</style>
