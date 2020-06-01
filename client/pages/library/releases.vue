<template>
  <Page>
    <div :class="$style.LibraryTracksPage">
      <h1
        :class="$style.LibraryTracksPage__title"
        v-text="title"
      />

      <div :class="$style.LibraryTracksPage__cardContainer">
        <ReleaseCard
          v-for="release in releaseList"
          :key="release.id"
          v-bind="release"
          :width="180"
          :max-width="200"
          :class="$style.LibraryTracksPage__card"
        />

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
        :class="$style.LibraryTracksPage__loading"
      >
        <v-progress-circular
          v-if="!isFullReleaseList"
          indeterminate
        />
      </div>
    </div>
  </Page>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import Page from '~/components/globals/Page.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
  title: string
}

const LIMIT_OF_RELEASES = 30 as const;

@Component({
  components: {
    Page,
    ReleaseCard,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/releases/releaseListLength'] === 0) {
      await app.$dispatch('library/releases/getSavedReleaseList', { limit: LIMIT_OF_RELEASES });
    } else {
      await app.$dispatch('library/releases/updateLatestSavedTrackList');
    }
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined
  title = 'お気に入りのアルバム'

  get releaseList(): App.ReleaseCardInfo[] | null {
    return this.$state().library.releases.releaseList;
  }
  get isFullReleaseList(): boolean {
    return this.$state().library.releases.isFullReleaseList;
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
          this.$dispatch('library/releases/getSavedReleaseList');
        }
      });
    });
    this.observer.observe(loading);
  }
}
</script>

<style lang="scss" module>
.LibraryTracksPage {
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
