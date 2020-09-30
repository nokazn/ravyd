<template>
  <div
    v-if="categoryInfo != null"
    :class="$style.GenreIdPage"
  >
    <h1 :class="$style.GenreIdPage__title">
      {{ categoryInfo.name }}
    </h1>

    <CardsWrapper
      v-if="playlists.length > 0"
      :min-wdith="$window.cardWidthMinMax[0]"
      :max-wdith="$window.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="playlist in playlists"
        :key="playlist.id"
        v-bind="playlist"
        :min-width="$window.cardWidthMinMax[0]"
        :max-width="$window.cardWidthMinMax[1]"
      />
    </CardsWrapper>
    <p v-else>
      プレイリストが見つかりません。
    </p>

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

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getCategory, getCategoryPlaylist } from '~/plugins/local/_genreId';
import { convertPlaylistForCard } from '~/utils/converter';
import { App, OneToFifty } from '~~/types';

interface AsyncData {
  categoryInfo: App.CategoryInfo | undefined
  playlists: App.PlaylistCardInfo[]
  isFullPlaylists: boolean
}
interface Data {}

const LIMIT_OF_PLAYLISTS = 30;

@Component({
  components: {
    CardsWrapper,
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
  padding: 16px max(12px, 2vw) 48px;

  &__title {
    padding-left: 3%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
