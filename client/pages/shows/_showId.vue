<template>
  <div
    v-if="showInfo != null"
    :class="$style.ShowIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="showInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <ContextMediaButton
          fab
          :height="32"
          :is-playing="isShowSet && isPlaying"
          :disabled="!hasEpisodes"
          @on-clicked="onContextMediaButtonClicked"
        />

        <FavoriteButton
          :size="32"
          outlined
          :is-favorited="isSaved"
          @on-clicked="toggleSavedState"
        />

        <ShowMenu
          :show="showInfo"
          :is-saved="isSaved"
          :size="32"
          outlined
          left
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
        :alt="showInfo.name"
        :size="ARTWORK_SIZE"
        :title="showInfo.name"
        shadow
      />

      <div :class="$style.Info">
        <div>
          <span class="g-small-text">
            ポッドキャスト
          </span>
          <ExplicitChip
            v-if="showInfo.explicit"
            :class="$style.Info__explicitIcon"
          />
        </div>

        <h1 :class="$style.Info__title">
          {{ showInfo.name }}
        </h1>

        <p>
          {{ showInfo.publisher }}
        </p>

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isShowSet && isPlaying"
              :disabled="!hasEpisodes"
              @on-clicked="onContextMediaButtonClicked"
            />

            <FavoriteButton
              :is-favorited="isSaved"
              outlined
              @on-clicked="toggleSavedState"
            />

            <ShowMenu
              :show="showInfo"
              :is-saved="isSaved"
              outlined
              @on-save-menu-clicked="toggleSavedState"
            />
          </div>

          <div :class="$style.Info__detail">
            <ReleaseTotalTracks
              :total="showInfo.totalEpisodes"
              unit="個のエピソード"
            />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="showInfo.description"
      class="subtext--text"
      v-html="showInfo.description"
    />

    <EpisodeTable
      :episode-list="showInfo.episodeList"
      :uri="showInfo.uri"
      :publisher="showInfo.publisher"
      :class="$style.ShowIdPage__table"
    />

    <IntersectionLoadingCircle
      :is-loading="!showInfo.isFullEpisodeList"
      @on-appeared="appendEpisodeList"
    />

    <Copyrights :copyright-list="showInfo.copyrightList" />
  </div>

  <Fallback v-else>
    ポッドキャストの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ExplicitChip from '~/components/parts/chip/ExplicitChip.vue';
import EpisodeTable from '~/components/containers/table/EpisodeTable.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import ShowMenu, { On as OnMenu } from '~/components/parts/menu/ShowMenu.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getShowInfo, getIsSaved } from '~/plugins/local/_showId';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { convertEpisodeDetail } from '~/scripts/converter/convertEpisodeDetail';
import { App, OneToFifty, SpotifyAPI } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_EPISODES = 30;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  showInfo: App.ShowInfo | undefined
  isSaved: boolean
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
  ARTWORK_SIZE: number
  HEADER_REF: string
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
      showInfo,
      isSaved,
    ] = await Promise.all([
      await getShowInfo(context),
      await getIsSaved(context),
    ] as const);

    return {
      showInfo,
      isSaved,
    };
  },
})
export default class ShowIdPage extends Vue implements AsyncData, Data {
  showInfo: App.ShowInfo | undefined = undefined;
  isSaved = false;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.showInfo?.name ?? 'エラー',
    };
  }
  get artworkSrc(): string | undefined {
    return getImageSrc(this.showInfo?.images, ARTWORK_SIZE);
  }
  get isShowSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.showInfo?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }
  get hasEpisodes(): boolean {
    return (this.showInfo?.episodeList.length ?? 0) > 0;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.showInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.showInfo?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    // エピソードをフォロー/アンフォローした後呼ばれる
    const subscribeSavedShow = (mutationPayload: ExtendedMutationPayload<'library/shows/SET_ACTUAL_IS_SAVED'>) => {
      if (this.showInfo == null) return;

      const [showId, isSaved] = mutationPayload.payload;
      if (showId === this.showInfo.id) {
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
    type PagingTracks = SpotifyAPI.Paging<SpotifyAPI.PlaylistTrack>;
    if (this.showInfo == null
      || this.showInfo.isFullEpisodeList) return;

    const { showInfo } = this;
    const { showId } = this.$route.params;
    const offset = this.showInfo.episodeList.length;
    const episodes = await this.$spotify.shows.getShowEpisodes({
      showId,
      market: this.$getters()['auth/userCountryCode'],
      limit,
      offset,
    });
    if (episodes == null) {
      this.$toast.push({
        color: 'error',
        message: 'エピソードが取得できませんでした。',
      });

      this.showInfo = {
        ...showInfo,
        isFullEpisodeList: true,
      };
      return;
    }

    const episodeList = episodes.items.map(convertEpisodeDetail<SpotifyAPI.SimpleEpisode>({
      offset,
      showId,
      showName: showInfo.name,
    }));
    const isFullEpisodeList = episodes.next == null;

    this.showInfo = {
      ...showInfo,
      episodeList: [...showInfo.episodeList, ...episodeList],
      isFullEpisodeList,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.showInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('playback/play', this.isShowSet
        ? undefined
        : { contextUri: this.showInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleSavedState(nextSavedState: OnFavoriteButton['on-clicked'] | OnMenu['on-save-menu-clicked']) {
    if (this.showInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isSaved = nextSavedState;
    const showIdList = [this.showInfo.id];
    if (nextSavedState) {
      this.$dispatch('library/shows/saveShows', showIdList);
    } else {
      this.$dispatch('library/shows/removeShows', showIdList);
    }
  }
}
</script>

<style lang="scss" module>
.AdditionalHeaderContent {
  display: flex;
  flex-wrap: nowrap;

  & > *:not(:last-child) {
    margin-right: 0.5vw;
  }
}

.ShowIdPage {
  padding: 16px max(12px, 4vw) 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    column-gap: 24px;
    margin-bottom: 32px;
  }

  .Info {
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;

    &__explicitIcon {
      margin-bottom: 0.1rem;
    }

    &__title {
      font-size: 2em;
      margin: 0.3em 0;
      line-height: 1.2em;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    &__buttons {
      display: flex;
      flex-wrap: nowrap;
      margin-right: 24px;

      & > *:not(:last-child) {
        margin-right: 12px;
      }
    }

    &__detail {
      margin-top: 12px;

      & > *:not(:last-child) {
        margin-right: 8px;
      }
    }
  }

  &__table {
    margin-bottom: 32px;
  }
}
</style>
