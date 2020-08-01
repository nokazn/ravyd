<template>
  <div
    v-if="categoryInfo != null"
    :class="$style.GenreIdPage"
  >
    <h1 :class="$style.GenreIdPage__title">
      {{ categoryInfo.name }}
    </h1>

    <div
      v-if="playlists.length > 0"
      :class="$style.Cards"
    >
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        v-bind="playlist"
        :min-width="MIN_IMAGE_SIZE"
        :max-width="MAX_IMAGE_SIZE"
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
      :is-loading="!isFullPlaylists"
      @on-appeared="appendCategoryPlaylist"
    />
  </div>

  <Fallback v-else>
    プレイリストの一覧を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';
import { getCategory, getCategoryPlaylist } from '~/plugins/local/_genreId';
import { convertPlaylistForCard } from '~/scripts/converter/convertPlaylistForCard';
import { App, OneToFifty } from '~~/types';

interface AsyncData {
  categoryInfo: App.CategoryInfo | undefined
  playlists: App.PlaylistCardInfo[]
  isFullPlaylists: boolean
}

interface Data {
  MIN_IMAGE_SIZE: number
  MAX_IMAGE_SIZE: number
}

const MIN_IMAGE_SIZE = 180;
const MAX_IMAGE_SIZE = 240;
const LIMIT_OF_PLAYLISTS = 30;

@Component({
  components: {
    PlaylistCard,
    IntersectionLoadingCircle,
    Fallback,
  },

  validate({ params }) {
    return params.genreId != null && params.genreId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [categoryInfo, playlists] = await Promise.all([
      getCategory(context),
      getCategoryPlaylist(context, LIMIT_OF_PLAYLISTS),
    ] as const);
    const isFullPlaylists = playlists.length < LIMIT_OF_PLAYLISTS;

    return {
      isFullPlaylists,
      categoryInfo,
      playlists,
    };
  },
})
export default class GenreIdPage extends Vue implements AsyncData, Data {
  categoryInfo: App.CategoryInfo | undefined = undefined;
  playlists: App.PlaylistCardInfo[] = [];
  isFullPlaylists = false;

  MIN_IMAGE_SIZE = MIN_IMAGE_SIZE
  MAX_IMAGE_SIZE = MAX_IMAGE_SIZE

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  /**
   * plugins/local の getCategoryPlaylist と同じ処理で、スクロールが下限に到達したとき呼ばれる
   */
  async appendCategoryPlaylist(limit: OneToFifty = LIMIT_OF_PLAYLISTS) {
    if (this.isFullPlaylists) return;

    const { playlists: currentPlaylists } = this;
    const { genreId: categoryId } = this.$route.params;
    const country = this.$getters()['auth/userCountryCode'];
    const offset = this.playlists.length;
    const { playlists } = await this.$spotify.browse.getCategoryPlaylist({
      categoryId,
      country,
      limit,
      offset,
    });
    if (playlists == null) {
      this.isFullPlaylists = true;
      return;
    }

    const addedPlaylists = playlists.items.map(convertPlaylistForCard);
    this.playlists = currentPlaylists != null
      ? [...currentPlaylists, ...addedPlaylists]
      : addedPlaylists;

    if (playlists.next == null) {
      this.isFullPlaylists = true;
    }
  }
}
</script>

<style lang="scss" module>
.GenreIdPage {
  padding: 16px max(12px, 4vw) 48px;

  &__title {
    padding-left: 3%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }

  .Cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

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

    &__spacer {
      height: 0;
    }
  }
}
</style>
