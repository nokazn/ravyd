<template>
  <div :class="$style.LibraryArtistsPage">
    <div :class="$style.Cards">
      <template v-if="artistList != null">
        <ArtistCard
          v-for="artist in artistList"
          :key="artist.id"
          v-bind="artist"
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

import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {
  observer: IntersectionObserver | undefined
}

const LIMIT_OF_ARTISTS = 30;

@Component({
  components: {
    ArtistCard,
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
  observer: IntersectionObserver | undefined = undefined

  get artistList(): RootState['library']['artists']['artistList'] {
    return this.$state().library.artists.artistList;
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
