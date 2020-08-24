<template>
  <div :class="$style.LibraryArtistsPage">
    <CardsWrapper>
      <ArtistCard
        v-for="artist in artistList"
        :key="artist.id"
        v-bind="artist"
        :min-width="FLEX_CARD_MIN_WIDTH"
        :max-width="FLEX_CARD_MAX_WIDTH"
      />
    </CardsWrapper>

    <IntersectionLoadingCircle
      :is-loading="!isFull"
      @on-appeared="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, RootGetters } from 'typed-vuex';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/constants';

interface Data {
  observer: IntersectionObserver | undefined
  FLEX_CARD_MIN_WIDTH: number
  FLEX_CARD_MAX_WIDTH: number
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
  FLEX_CARD_MIN_WIDTH = FLEX_CARD_MIN_WIDTH;
  FLEX_CARD_MAX_WIDTH = FLEX_CARD_MAX_WIDTH;

  get artistList(): RootState['library']['artists']['artistList'] {
    return this.$state().library.artists.artistList ?? [];
  }
  get isFull(): RootGetters['library/artists/isFull'] {
    return this.$getters()['library/artists/isFull'];
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
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
