<template>
  <div :class="$style.LibraryReleasesPage">
    <div :class="$style.Cards">
      <ReleaseCard
        v-for="release in releaseList"
        :key="release.id"
        v-bind="release"
        :min-width="180"
        :max-width="240"
        :class="$style.Cards__card"
      />

      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
    </div>

    <IntersectionLoadingCircle
      :is-loading="!isFull"
      @on-appeared="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, RootGetters } from 'typed-vuex';

import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {}

const LIMIT_OF_RELEASES = 30;

@Component({
  components: {
    ReleaseCard,
    IntersectionLoadingCircle,
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

  .Cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    & > * {
      margin-left: 16px;
      margin-right: 16px;
      flex: 1 0 180px;
      min-width: 180px;
      max-width: 240px;
    }

    &__card {
      margin-bottom: 32px;
    }

    // 最終行の余りの部分を埋める
    &__spacer {
      height: 0;
    }
  }
}
</style>
