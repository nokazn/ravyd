<template>
  <div :class="$style.LibraryShowsPage">
    <h1 :class="$style.LibraryShowsPage__title">
      {{ title }}
    </h1>

    <div :class="$style.Cards">
      <template v-if="showList != null">
        <ShowCard
          v-for="(show, index) in showList"
          :key="`${show.id}-${index}`"
          v-bind="show"
          :min-width="180"
          :max-width="240"
          :class="$style.Cards__card"
        />
      </template>

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

import ShowCard from '~/components/containers/card/ShowCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {
  title: string
}

const LIMIT_OF_SHOWS = 30;

@Component({
  components: {
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
})
export default class LibraryShowsPage extends Vue implements Data {
  title = 'お気に入りのポッドキャスト'

  head() {
    return {
      title: this.title,
    };
  }

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
  padding: 16px max(12px, 3vw) 48px;

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
