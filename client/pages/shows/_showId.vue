<template>
  <div
    v-if="show != null"
    :class="$style.ShowIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="show != null"
        :class="$style.Fab"
      >
        <ContextMediaButton
          :fab="!$screen.isSp"
          :disabled="!hasEpisodes"
          :value="isShowSet && isPlaying"
          @input="onContextMediaButtonClicked"
        />
        <FavoriteButton
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :value="isSaved"
          @input="toggleSavedState"
        />
        <ShowMenu
          left
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :saved="isSaved"
          :show="show"
          @on-save-menu-clicked="toggleSavedState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.ShowIdPage__header"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="show.name"
        :size="ARTWORK_SIZE"
        :title="show.name"
        shadow
      />

      <div :class="$style.Info">
        <div>
          <span class="g-small-text">
            ポッドキャスト
          </span>
          <ExplicitChip
            v-if="show.explicit"
            :class="$style.Info__explicitIcon"
          />
        </div>

        <h1 :class="$style.Info__title">
          {{ show.name }}
        </h1>

        <p class="subtext--text">
          {{ show.publisher }}・{{ show.totalEpisodes }}個のエピソード
        </p>

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :disabled="!hasEpisodes"
              :value="isShowSet && isPlaying"
              @input="onContextMediaButtonClicked"
            />
            <FavoriteButton
              outlined
              :value="isSaved"
              @input="toggleSavedState"
            />
            <ShowMenu
              outlined
              :left="$screen.isSingleColumn"
              :right="$screen.isMultiColumn"
              :show="show"
              :saved="isSaved"
              @on-save-menu-clicked="toggleSavedState"
            />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="show.description"
      class="subtext--text"
      :class="$style.ShowIdPage__description"
      v-html="show.description"
    />

    <EpisodeTable
      :episodes="show.episodeList"
      :uri="show.uri"
      :publisher="show.publisher"
      :class="$style.ShowIdPage__table"
    />

    <IntersectionLoadingCircle
      :loading="show.hasNextEpisode"
      @appear="appendEpisodeList"
    />

    <Copyrights :copyrights="show.copyrightList" />
  </div>

  <Fallback v-else>
    ポッドキャストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import type { OneToFifty, SpotifyAPI } from 'shared/types';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import EpisodeTable from '~/components/containers/table/EpisodeTable.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import ShowMenu, { On as OnMenu } from '~/components/parts/menu/ShowMenu.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';

import { getShow, getIsSaved } from '~/services/local/_showId';
import { getImageSrc, convertEpisodeDetail } from '~/services/converter';
import type { App } from '~/entities';

const ARTWORK_SIZE = 220;
const LIMIT_OF_EPISODES = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  show: App.ShowPage | undefined;
  isSaved: boolean;
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined;
  ARTWORK_SIZE: number;
  HEADER_REF: string;
}

@Component({
  components: {
    ReleaseArtwork,
    ExplicitChip,
    EpisodeTable,
    ContextMediaButton,
    FavoriteButton,
    ShowMenu,
    ReleaseTotalTracks,
    IntersectionLoadingCircle,
    Copyrights,
    Fallback,
  },

  validate({ params }) {
    return params.showId != null && params.showId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const [
      show,
      isSaved,
    ] = await Promise.all([
      await getShow(context),
      await getIsSaved(context),
    ] as const);

    return {
      show,
      isSaved,
    };
  },
})
export default class ShowIdPage extends Vue implements AsyncData, Data {
  show: App.ShowPage | undefined = undefined;
  isSaved = false;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.show?.name ?? 'エラー',
    };
  }
  get artworkSrc(): string | undefined {
    return getImageSrc(this.show?.images, ARTWORK_SIZE);
  }
  get isShowSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.show?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get hasEpisodes(): boolean {
    return (this.show?.episodeList.length ?? 0) > 0;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.show != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.show?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    // エピソードをフォロー/アンフォローした後呼ばれる
    const subscribeSavedShow = (mutationPayload: ExtendedMutationPayload<'library/shows/SET_ACTUAL_IS_SAVED'>) => {
      if (this.show == null) return;
      const [showId, isSaved] = mutationPayload.payload;
      if (showId === this.show.id) {
        this.isSaved = isSaved;
      }
      this.$commit('library/shows/DELETE_ACTUAL_IS_SAVED', showId);
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'library/shows/SET_ACTUAL_IS_SAVED':
          subscribeSavedShow(mutation as ExtendedMutationPayload<typeof type>);
          break;
        default:
          break;
      }
    });
  }

  beforeDestroy() {
    this.$header.disconnectObserver();

    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  async appendEpisodeList(limit: OneToFifty = LIMIT_OF_EPISODES) {
    if (this.show == null || this.show.hasNextEpisode) return;

    const currentShow = this.show;
    const { showId } = this.$route.params;
    const offset = this.show.episodeList.length;
    const episodes = await this.$spotify.shows.getShowEpisodes({
      showId,
      market: this.$getters()['auth/userCountryCode'],
      limit,
      offset,
    });
    if (episodes == null) {
      this.$toast.pushError('エピソードが取得できませんでした。');
      this.show = {
        ...currentShow,
        hasNextEpisode: false,
      };
      return;
    }

    const episodeList = episodes.items.map(convertEpisodeDetail<SpotifyAPI.SimpleEpisode>({
      offset,
      showId,
      showName: currentShow.name,
    }));
    this.show = {
      ...currentShow,
      episodeList: [...currentShow.episodeList, ...episodeList],
      hasNextEpisode: episodes.next != null,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    if (this.show == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isShowSet
        ? undefined
        : { contextUri: this.show.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleSavedState(nextSavedState: OnFavoriteButton['input'] | OnMenu['on-save-menu-clicked']) {
    if (this.show == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isSaved = nextSavedState;
    const showIdList = [this.show.id];
    if (nextSavedState) {
      this.$dispatch('library/shows/saveShows', showIdList);
    } else {
      this.$dispatch('library/shows/removeShows', showIdList);
    }
  }
}
</script>

<style lang="scss" module>
.Fab {
  @include global-fab();
}

$margin-bottom: 32px;

.ShowIdPage {
  @include page-margin();
  @include page-padding();

  &__header {
    @include page-header();

    margin-bottom: $margin-bottom;
  }

  &__description,
  &__table {
    // v-application p のデフォルトのスタイルを上書き
    margin-bottom: $margin-bottom !important;
  }
}

.Info {
  @include page-info();

  &__explicitIcon {
    margin-bottom: 0.1rem;
  }

  &__title {
    @include page-title();
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  &__buttons {
    @include page-header-buttons();
  }
}
</style>
