<template>
  <div :class="$style.LibraryShowsPage">
    <CardsWrapper
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <ShowCard
        v-for="(show, index) in showList"
        :key="`${show.id}-${index}`"
        :item="show"
        :min-width="$screen.cardWidthMinMax[0]"
        :max-width="$screen.cardWidthMinMax[1]"
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

import type { SpotifyAPI } from 'shared/types';
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
  get showList(): SpotifyAPI.SimpleShow[] {
    return this.$getters()['library/shows/showList'];
  }
  get isFull(): boolean {
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
