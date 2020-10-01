<template>
  <div :class="$style.LibraryShowsPage">
    <CardsWrapper
      :min-width="$window.cardWidthMinMax[0]"
      :max-width="$window.cardWidthMinMax[1]"
    >
      <ShowCard
        v-for="(show, index) in showList"
        :key="`${show.id}-${index}`"
        v-bind="show"
        :min-width="$window.cardWidthMinMax[0]"
        :max-width="$window.cardWidthMinMax[1]"
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
  get showList(): RootState['library']['shows']['showList'] {
    return this.$state().library.shows.showList;
  }
  get isFull(): RootGetters['library/shows/isFull'] {
    return this.$getters()['library/shows/isFull'];
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
