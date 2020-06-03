<template>
  <div :class="$style.LibraryArtistsPage">
    <h1
      :class="$style.LibraryArtistsPage__title"
      v-text="title"
    />

    <div :class="$style.LibraryArtistsPage__cardContainer">
      <template v-if="artistList != null">
        <ArtistCard
          v-for="artist in artistList"
          :key="artist.id"
          v-bind="artist"
          :width="180"
          :max-width="200"
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

    <div
      ref="loading"
      :class="$style.LibraryArtistsPage__loading"
    >
      <v-progress-circular
        v-if="!isFullArtistList"
        indeterminate
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import ArtistCard from '~/components/containers/card/ArtistCard.vue';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
  title: string
}

const LIMIT_OF_ARTISTS = 30 as const;

@Component({
  components: {
    ArtistCard,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/artists/artistListLength'] === 0) {
      await app.$dispatch('library/artists/getSavedArtistList', { limit: LIMIT_OF_ARTISTS });
    } else {
      await app.$dispatch('library/artists/updateLatestSavedArtistList');
    }
  },
})
export default class LibraryArtistsPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined
  title = 'お気に入りのアーティスト'

  get artistList(): App.ArtistCardInfo[] | null {
    return this.$state().library.artists.artistList;
  }
  get isFullArtistList(): boolean {
    return this.$state().library.artists.isFullArtistList;
  }

  head() {
    return {
      title: this.title,
    };
  }

  mounted() {
    const loading = this.$refs.loading as HTMLDivElement;

    // loading が表示されたら新たに読み込む
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$dispatch('library/artists/getSavedArtistList');
        }
      });
    });
    this.observer.observe(loading);
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
      max-width: 200px;
    }
  }
  &__card {
    margin-bottom: 32px;
  }
  // 最終行の余りの部分を埋める
  &__cardSpacer {
    height: 0;
  }

  &__loading {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
