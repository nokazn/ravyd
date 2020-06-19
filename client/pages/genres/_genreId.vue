<template>
  <div :class="$style.GenreIdPage">
    <h1
      v-if="categoryInfo != null"
      :class="$style.GenreIdPage__title"
    >
      {{ categoryInfo.name }}
    </h1>

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

    <IntersectionLoadingCircle
      :is-loading="!isFullPlaylists"
      @on-appeared="getCategoryPlaylist"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { getCategory, getCategoryPlaylist } from '~/scripts/localPlugins/genreId';
import { convertPlaylistForCard } from '~/scripts/converter/convertPlaylistForCard';
import { App } from '~~/types';

interface AsyncData {
  maxImageSize: number
  categoryInfo: App.CategoryInfo | null
  playlists: App.PlaylistCardInfo[] | null
  isFullPlaylists: boolean
}

const MAX_IMAGE_SIZE = 220;
const LIMIT_OF_PLAYLISTS = 30;

@Component({
  components: {
    PlaylistCard,
    IntersectionLoadingCircle,
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
export default class GenreIdPage extends Vue implements AsyncData {
  maxImageSize = MAX_IMAGE_SIZE
  categoryInfo: App.CategoryInfo | null = null;
  playlists: App.PlaylistCardInfo[] | null = null;
  isFullPlaylists = false;

  /**
   * localPlugins の getCategoryPlaylist と同じ処理で、スクロールが下限に到達したとき呼ばれる
   */
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
    if (playlists == null) {
      this.isFullPlaylists = true;
      return;
    }

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
  padding: 16px 3% 48px;

  &__title {
    padding-left: 3%;
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

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
