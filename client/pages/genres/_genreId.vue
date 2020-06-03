<template>
  <div :class="$style.GenreIdPage">
    <h1
      v-if="categoryInfo != null"
      v-text="categoryInfo.name"
    />

    <div
      v-if="playlists != null"
      :class="$style.GenreIdPage__playlistCardContainer"
    >
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        v-bind="playlist"
        :max-width="maxImageSize"
        :class="$style.GenreIdPage__playlistCard"
      />

      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
      <div :class="$style.GenreIdPage__spacer" />
    </div>

    <div
      ref="loading"
      :class="$style.GenreIdPage__loading"
    >
      <v-progress-circular
        v-if="!isFullPlaylists"
        indeterminate
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import { getCategory, getCategoryPlaylist } from '~/scripts/localPlugins/genreId';
import { convertPlaylistForCard } from '~/scripts/converter/convertPlaylistForCard';
import { App } from '~~/types';

interface AsyncData {
  maxImageSize: number
  categoryInfo: App.CategoryInfo | null
  playlists: App.PlaylistCardInfo[] | null
  isFullPlaylists: boolean
}

interface Data {
  observer: IntersectionObserver | undefined
}

const MAX_IMAGE_SIZE = 220;
const LIMIT_OF_PLAYLISTS = 30;

@Component({
  components: {
    PlaylistCard,
  },

  validate({ params }) {
    return params.genreId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const maxImageSize = MAX_IMAGE_SIZE;
    const [categoryInfo, playlists] = await Promise.all([
      getCategory(context, maxImageSize),
      getCategoryPlaylist(context, maxImageSize, LIMIT_OF_PLAYLISTS),
    ]);

    const isFullPlaylists = playlists == null
      || (playlists != null && playlists.length < LIMIT_OF_PLAYLISTS);

    return {
      maxImageSize,
      isFullPlaylists,
      categoryInfo,
      playlists,
    };
  },
})
export default class GenreIdPage extends Vue implements AsyncData, Data {
  maxImageSize = MAX_IMAGE_SIZE
  categoryInfo: App.CategoryInfo | null = null;
  playlists: App.PlaylistCardInfo[] | null = null;
  isFullPlaylists = false;

  observer: IntersectionObserver | undefined = undefined;

  mounted() {
    const loading = this.$refs.loading as HTMLDivElement;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.getCategoryPlaylist();
        }
      });
    });
    this.observer.observe(loading);
  }

  beforeDestroy() {
    if (this.observer != null) this.observer.disconnect();
  }

  async getCategoryPlaylist() {
    if (this.isFullPlaylists) return;

    const { genreId: categoryId } = this.$route.params;
    const country = this.$getters()['auth/userCountryCode'];
    const offset = this.playlists?.length;
    const { playlists } = await this.$spotify.browse.getCategoryPlaylist({
      categoryId,
      country,
      limit: LIMIT_OF_PLAYLISTS,
      offset,
    });
    if (playlists == null) return;

    const addedPlaylists = playlists.items.map(convertPlaylistForCard(this.maxImageSize));
    this.playlists = this.playlists != null
      ? [...this.playlists, ...addedPlaylists]
      : addedPlaylists;

    if (playlists.next == null) {
      this.isFullPlaylists = true;
    }
  }
}
</script>

<style lang="scss" module>
.GenreIdPage {
  padding: 16px 6% 48px;

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
  &__playlistCardContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    & > * {
      margin-left: 16px;
      margin-right: 16px;
      flex: 1 0 180px;
      min-width: 180px;
      max-width: 220px;
    }
  }
  &__playlistCard {
    margin-bottom: 32px;
  }
  &__spacer {
    height: 0;
  }

  &__loading {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
