<template>
  <div
    v-if="releaseInfo != null"
    :class="$style.ReleaseIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="releaseInfo != null"
        :class="$style.AdditionalHeaderContent"
      >
        <ContextMediaButton
          fab
          :height="32"
          :is-playing="isReleaseSet && isPlaying"
          @on-clicked="onContextMediaButtonClicked"
        />

        <FavoriteButton
          :size="32"
          outlined
          :is-favorited="releaseInfo.isSaved"
          @on-clicked="toggleSavedState"
        />

        <ReleaseMenu
          :release="releaseInfo"
          :size="32"
          outlined
          left
          @on-favorite-menu-clicked="toggleSavedState"
        />
      </div>
    </portal>

    <div
      :ref="HEADER_REF"
      :class="$style.ReleaseIdPage__header"
    >
      <ReleaseArtwork
        :src="artworkSrc"
        :size="$window.artworkSize"
        :alt="releaseInfo.name"
        :title="releaseInfo.name"
        shadow
      />

      <div :class="$style.Info">
        <HashTags
          :tag-list="releaseInfo.genreList"
          color="subtext"
          text-color="white"
          outlined
          :class="$style.Info__hashTags"
        />

        <div class="g-small-text">
          {{ releaseInfo.releaseType }}
        </div>

        <h1 :class="$style.Info__title">
          {{ releaseInfo.name }}
        </h1>

        <ArtistNames
          avatar
          :artists="releaseInfo.artists"
        />

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :is-playing="isReleaseSet && isPlaying"
              @on-clicked="onContextMediaButtonClicked"
            />

            <FavoriteButton
              :is-favorited="releaseInfo.isSaved"
              outlined
              @on-clicked="toggleSavedState"
            />

            <ReleaseMenu
              :release="releaseInfo"
              outlined
              @on-favorite-menu-clicked="toggleSavedState"
            />
          </div>

          <div :class="$style.Info__detail">
            <ReleaseDate
              :release-date="releaseInfo.releaseDate"
              :release-date-precision="releaseInfo.releaseDatePrecision"
            />

            <ReleaseTotalTracks
              :total="releaseInfo.totalTracks"
            />

            <ReleaseDuration
              :duration-ms="releaseInfo.durationMs"
              :is-full="releaseInfo.isFullTrackList"
            />

            <ReleaseLabel
              :label="releaseInfo.label"
            />
          </div>
        </div>
      </div>
    </div>

    <TrackTable
      :track-list="releaseInfo.trackList"
      :uri="releaseInfo.uri"
      :class="$style.ReleaseIdPage__table"
      @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
    />

    <IntersectionLoadingCircle
      :is-loading="!releaseInfo.isFullTrackList"
      @on-appeared="appendTrackList"
    />

    <Copyrights
      :copyright-list="releaseInfo.copyrightList"
      :class="$style.ReleaseIdPage__copyrights"
    />

    <template v-for="artist in releaseInfo.artistReleaseList">
      <ScrollableCardsSection
        v-if="artist.items.length > 0"
        :key="artist.id"
        :title="`${artist.name}の他のリリース`"
        :class="$style.ReleaseIdPage__section"
      >
        <ReleaseCard
          v-for="release in artist.items"
          :key="release.id"
          v-bind="release"
          :width="$window.cardWidth"
          discograpy
        />
      </ScrollableCardsSection>
    </template>
  </div>

  <Fallback v-else>
    アルバムの情報を取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, ExtendedMutationPayload } from 'typed-vuex';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseMenu, { On as OnMenu } from '~/components/parts/menu/ReleaseMenu.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import TrackTable, { On as OnTable } from '~/components/containers/table/TrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

import { getReleaseInfo } from '~/plugins/local/_releaseId';
import { checkTrackSavedState } from '~/utils/subscriber';
import { getImageSrc } from '~/utils/image';
import { convertTrackDetail } from '~/utils/converter';
import { SpotifyAPI, App, OneToFifty } from '~~/types';

const HEADER_REF = 'HEADER_REF';
const LIMIT_OF_TRACKS = 30;

interface AsyncData {
  releaseInfo: App.ReleaseInfo | undefined
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
  HEADER_REF: string
}

@Component({
  components: {
    ReleaseArtwork,
    HashTags,
    ArtistNames,
    ContextMediaButton,
    FavoriteButton,
    ReleaseMenu,
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    ReleaseLabel,
    TrackTable,
    IntersectionLoadingCircle,
    Copyrights,
    ScrollableCardsSection,
    ReleaseCard,
    Fallback,
  },

  validate({ params }: Context) {
    return params.releaseId != null && params.releaseId !== '';
  },

  async asyncData(context: Context): Promise<AsyncData> {
    const releaseInfo = await getReleaseInfo(context);

    return {
      releaseInfo,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData, Data {
  releaseInfo: App.ReleaseInfo | undefined = undefined;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.releaseInfo?.name ?? 'エラー',
    };
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.releaseInfo?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isReleaseSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.releaseInfo?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.releaseInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.releaseInfo?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      if (this.releaseInfo == null) return;

      const trackList = checkTrackSavedState<App.TrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.releaseInfo.trackList);

      this.releaseInfo = {
        ...this.releaseInfo,
        trackList,
      };
    };

    const subscribeRelease = ({ payload: [releaseId, isSaved] }: ExtendedMutationPayload<'library/releases/SET_ACTUAL_IS_SAVED'>) => {
      if (this.releaseInfo == null) return;

      if (releaseId === this.releaseInfo.id) {
        this.releaseInfo.isSaved = isSaved;
      }

      this.$commit('library/releases/DELETE_ACTUAL_IS_SAVED', releaseId);
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'library/tracks/SET_ACTUAL_IS_SAVED':
          subscribeTrack(mutation as ExtendedMutationPayload<typeof type>);
          break;

        case 'library/releases/SET_ACTUAL_IS_SAVED':
          subscribeRelease(mutation as ExtendedMutationPayload<typeof type>);
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

  async appendTrackList(limit: OneToFifty = LIMIT_OF_TRACKS) {
    if (this.releaseInfo == null
      || this.releaseInfo.isFullTrackList) return;

    const { releaseInfo } = this;
    const releaseId = releaseInfo.id;
    const offset = this.releaseInfo.trackList.length;
    const tracks = await this.$spotify.albums.getAlbumTracks({
      albumId: releaseId,
      market: this.$getters()['auth/userCountryCode'],
      limit,
      offset,
    });
    if (tracks == null) {
      this.$toast.push({
        color: 'error',
        message: 'トラックが取得できませんでした。',
      });

      this.releaseInfo = {
        ...releaseInfo,
        isFullTrackList: true,
      };
      return;
    }

    const trackIdList = tracks.items.map((track) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = tracks.items.map(convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      offset,
      releaseId,
      releaseName: releaseInfo.name,
      artistIdList: releaseInfo.artists.map((artist) => artist.id),
      images: releaseInfo.images,
    }));
    const durationMs = trackList.reduce((prev, curr) => prev + curr.durationMs, 0);
    const isFullTrackList = tracks.next == null;

    this.releaseInfo = {
      ...releaseInfo,
      trackList: [...releaseInfo.trackList, ...trackList],
      durationMs: releaseInfo.durationMs + durationMs,
      isFullTrackList,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnFavorite['on-clicked']) {
    if (this.releaseInfo == null) return;

    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('playback/play', this.isReleaseSet
        ? undefined
        : { contextUri: this.releaseInfo.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleSavedState(nextSavedState: OnMediaButton['on-clicked'] | OnMenu['on-favorite-menu-clicked']) {
    if (this.releaseInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.releaseInfo.isSaved = nextSavedState;
    const releaseIdList = [this.releaseInfo.id];
    if (nextSavedState) {
      this.$dispatch('library/releases/saveReleases', releaseIdList);
    } else {
      this.$dispatch('library/releases/removeReleases', releaseIdList);
    }
  }

  onFavoriteTrackButtonClicked({ index, id, isSaved }: OnTable['on-favorite-button-clicked']) {
    if (this.releaseInfo == null) return;

    const nextSavedState = !isSaved;
    const { releaseInfo } = this;
    const trackList = [...releaseInfo.trackList];
    trackList[index].isSaved = nextSavedState;
    this.releaseInfo = {
      ...releaseInfo,
      trackList,
    };

    if (nextSavedState) {
      this.$dispatch('library/tracks/saveTracks', [id]);
    } else {
      this.$dispatch('library/tracks/removeTracks', [id]);
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

.ReleaseIdPage {
  $margin-bottom: 32px;

  @include page-margin($g-gradation-width);
  @include page-padding;

  &__header {
    margin-bottom: $margin-bottom * 0.75;

    @include smaller-than-sm {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @include larger-than-sm {
      display: grid;
      grid-template-columns: $g-artwork-base-size auto;
      column-gap: 24px;
    }
  }

  .Info {
    display: flex;
    flex-direction: column;

    @include smaller-than-sm {
      align-items: center;
    }

    @include larger-than-sm {
      justify-content: flex-end;
    }

    &__hashTags {
      // border-radius の分だけ右にあるように見えてしまうので調整
      margin-left: -8px;
      margin-bottom: 12px;
    }

    &__title {
      font-size: 2em;
      margin: 0.3em 0;
      line-height: 1.2em;

      @include smaller-than-sm {
        text-align: center;
      }
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      margin-top: 16px;

      @include smaller-than-sm {
        justify-content: center;
      }

      @include larger-than-sm {
        align-items: flex-end;
      }
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
    margin-bottom: $margin-bottom / 2;
  }

  &__copyrights,
  &__section {
    margin-bottom: $margin-bottom;
  }
}
</style>
