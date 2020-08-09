<template>
  <div :class="$style.LibraryReleasesPage">
    <CardsWrapper>
      <ReleaseCard
        v-for="release in releaseList"
        :key="release.id"
        v-bind="release"
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
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { FLEX_CARD_MIN_WIDTH, FLEX_CARD_MAX_WIDTH } from '~/variables';

interface Data {
  FLEX_CARD_MIN_WIDTH: number
  FLEX_CARD_MAX_WIDTH: number
}

const LIMIT_OF_RELEASES = 30;

@Component({
  components: {
    ReleaseCard,
    IntersectionLoadingCircle,
    CardsWrapper,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/releases/releaseListLength'] === 0) {
      await app.$dispatch('library/releases/getSavedReleaseList', {
        limit: LIMIT_OF_RELEASES,
      });
    } else {
      await app.$dispatch('library/releases/updateLatestSavedReleaseList');
    }
  },

  head() {
    return {
      title: 'お気に入りのアルバム',
    };
  },
})
export default class LibraryReleasesPage extends Vue implements Data {
  FLEX_CARD_MIN_WIDTH = FLEX_CARD_MIN_WIDTH;
  FLEX_CARD_MAX_WIDTH = FLEX_CARD_MAX_WIDTH;

  get releaseList(): RootState['library']['releases']['releaseList'] {
    return this.$state().library.releases.releaseList;
  }
  get isFull(): RootGetters['library/releases/isFull'] {
    return this.$getters()['library/releases/isFull'];
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  onLoadingCircleAppeared() {
    this.$dispatch('library/releases/getSavedReleaseList', {
      limit: LIMIT_OF_RELEASES,
    });
  }
}
</script>

<style lang="scss" module>
.LibraryReleasesPage {
  & > * {
    margin-bottom: 24px;
  }
}
</style>
