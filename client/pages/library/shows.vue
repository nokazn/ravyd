<template>
  <div :class="$style.LibraryShowsPage">
    <CardsWrapper>
      <ShowCard
        v-for="(show, index) in showList"
        :key="`${show.id}-${index}`"
        v-bind="show"
        :min-width="FLEX_CARD_MIN_WIDTH"
        :max-width="FLEX_CARD_MAX_WIDTH"
        :class="$style.Cards__card"
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
import ShowCard from '~/components/containers/card/ShowCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/variables';

interface Data {}

const LIMIT_OF_SHOWS = 30;

@Component({
  components: {
    CardsWrapper,
    ShowCard,
    IntersectionLoadingCircle,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/shows/showListLength'] === 0) {
      await app.$dispatch('library/shows/getSavedShowList', {
        limit: LIMIT_OF_SHOWS,
      });
    } else {
      await app.$dispatch('library/shows/updateLatestSavedShowList');
    }
  },

  head() {
    return {
      title: 'お気に入りのポッドキャスト',
    };
  },
})
export default class LibraryShowsPage extends Vue implements Data {
  FLEX_CARD_MIN_WIDTH = FLEX_CARD_MIN_WIDTH;
  FLEX_CARD_MAX_WIDTH = FLEX_CARD_MAX_WIDTH;

  get showList(): RootState['library']['shows']['showList'] {
    return this.$state().library.shows.showList;
  }
  get isFull(): RootGetters['library/shows/isFull'] {
    return this.$getters()['library/shows/isFull'];
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  onLoadingCircleAppeared() {
    this.$dispatch('library/shows/getSavedShowList', {
      limit: LIMIT_OF_SHOWS,
    });
  }
}
</script>

<style lang="scss" module>
.LibraryShowsPage {
  & > * {
    margin-bottom: 24px;
  }
}
</style>
