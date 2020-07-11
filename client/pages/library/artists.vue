<template>
  <div :class="$style.LibraryArtistsPage">
    <h1 :class="$style.LibraryArtistsPage__title">
      {{ title }}
    </h1>

    <div :class="$style.LibraryArtistsPage__cardContainer">
      <template v-if="artistList != null">
        <ArtistCard
          v-for="artist in artistList"
          :key="artist.id"
          v-bind="artist"
          :min-width="180"
          :max-width="240"
          :class="$style.LibraryArtistsPage__card"
        />
      </template>

      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
      <div :class="$style.ArtistIdPage__cardSpacer" />
    </div>

    <IntersectionLoadingCircle
      :is-loading="!isFullArtistList"
      @on-appeared="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
  title: string
}

const LIMIT_OF_ARTISTS = 30 as const;

@Component({
  components: {
    ArtistCard,
    IntersectionLoadingCircle,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/artists/artistListLength'] === 0) {
      await app.$dispatch('library/artists/getSavedArtistList', {
        limit: LIMIT_OF_ARTISTS,
      }).catch((err: Error) => {
        console.error({ err });
        app.$toast.show('error', err.message);
      });
    } else {
      await app.$dispatch('library/artists/updateLatestSavedArtistList')
        .catch((err: Error) => {
          console.error({ err });
          app.$toast.show('error', err.message);
        });
    }
  },
})
export default class LibraryArtistsPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined
  title = 'お気に入りのアーティスト'

  head() {
    return {
      title: this.title,
    };
  }

  get artistList(): App.ArtistCardInfo[] | null {
    return this.$state().library.artists.artistList;
  }
  get isFullArtistList(): boolean {
    return this.$state().library.artists.isFullArtistList;
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  onLoadingCircleAppeared() {
    this.$dispatch('library/artists/getSavedArtistList', {
      limit: LIMIT_OF_ARTISTS,
    }).catch((err) => {
      console.error({ err });
      this.$toast.show('error', err.message);
    });
  }
}
</script>

<style lang="scss" module>
.LibraryArtistsPage {
  padding: 16px 3% 48px;

  & > * {
    margin-bottom: 24px;
  }

  &__cardContainer {
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
  }

  &__card {
    margin-bottom: 32px;
  }
  // 最終行の余りの部分を埋める
  &__cardSpacer {
    height: 0;
  }
}
</style>
