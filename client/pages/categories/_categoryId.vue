<template>
  <div
    v-if="category != null"
    :class="$style.CategoryIdPage"
  >
    <h1 :class="$style.CategoryIdPage__title">
      {{ category.name }}
    </h1>

    <CardsWrapper
      v-if="playlists.items.length > 0"
      :min-wdith="$screen.cardWidthMinMax[0]"
      :max-wdith="$screen.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="playlist in playlists.items"
        :key="playlist.id"
        :item="playlist"
        :min-width="$screen.cardWidthMinMax[0]"
        :max-width="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>
    <p v-else>
      プレイリストが見つかりません。
    </p>

    <IntersectionLoadingCircle
      :loading="playlists.hasNext"
      @appear="appendCategoryPlaylist"
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

import { getCategory, getCategoryPlaylists, CategoryPlaylists } from '~/services/local/_categoryId';
import { SpotifyAPI, OneToFifty } from '~~/types';

interface AsyncData {
  category: SpotifyAPI.Category | undefined;
  playlists: CategoryPlaylists;
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
    return params.categoryId != null && params.categoryId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [category, playlists] = await Promise.all([
      getCategory(context),
      getCategoryPlaylists(context, LIMIT_OF_PLAYLISTS),
    ] as const);

    return {
      category,
      playlists,
    };
  },
})
export default class CategoryIdPage extends Vue implements AsyncData, Data {
  category: SpotifyAPI.Category | undefined = undefined;
  playlists: CategoryPlaylists = {
    items: [],
    hasNext: false,
    hasPrevious: false,
  };

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  // plugins/local の getCategoryPlaylists と同じ処理で、スクロールが下限に到達したとき呼ばれる
  async appendCategoryPlaylist(limit: OneToFifty = LIMIT_OF_PLAYLISTS) {
    if (this.playlists.hasNext) return;

    const { playlists: currentPlaylists } = this;
    const { categoryId } = this.$route.params;
    const country = this.$getters()['auth/userCountryCode'];
    const offset = this.playlists.items.length;
    const { playlists } = await this.$spotify.browse.getCategoryPlaylists({
      categoryId,
      country,
      limit,
      offset,
    });
    if (playlists == null) {
      this.playlists = {
        ...currentPlaylists,
        hasNext: false,
      };
      return;
    }

    this.playlists = {
      ...currentPlaylists,
      items: [...currentPlaylists.items, ...playlists.items],
      hasNext: playlists.next != null,
    };
  }
}
</script>

<style lang="scss" module>
.CategoryIdPage {
  @include page-margin();

  &__title {
    padding-left: 3%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
