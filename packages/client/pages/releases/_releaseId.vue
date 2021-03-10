<template>
  <div
    v-if="release != null"
    :class="$style.ReleaseIdPage"
  >
    <portal :to="$header.PORTAL_NAME">
      <div
        v-if="release != null"
        :class="$style.Fab"
      >
        <ContextMediaButton
          :fab="!$screen.isSp"
          :value="isReleaseSet && isPlaying"
          @input="onContextMediaButtonClicked"
        />
        <FavoriteButton
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :value="release.isSaved"
          @input="toggleSavedState"
        />
        <ReleaseMenu
          left
          :fab="$screen.isSp"
          :outlined="!$screen.isSp"
          :release="release"
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
        :size="$screen.artworkSize"
        :alt="release.name"
        :title="release.name"
        shadow
      />

      <div :class="$style.Info">
        <HashTags
          outlined
          color="subtext"
          text-color="white"
          :tags="release.genreList"
          :class="$style.Info__hashTags"
        />

        <div class="g-small-text">
          {{ release.releaseType }}
        </div>

        <h1 :class="$style.Info__title">
          {{ release.name }}
        </h1>

        <ArtistNames
          avatar
          :artists="release.artists"
          :class="$style.Info__artists"
        />

        <div :class="$style.Info__footer">
          <div :class="$style.Info__buttons">
            <ContextMediaButton
              :value="isReleaseSet && isPlaying"
              @input="onContextMediaButtonClicked"
            />
            <FavoriteButton
              outlined
              :value="release.isSaved"
              @input="toggleSavedState"
            />
            <ReleaseMenu
              outlined
              :release="release"
              :left="$screen.isSingleColumn"
              :right="$screen.isMultiColumn"
              @on-favorite-menu-clicked="toggleSavedState"
            />
          </div>

          <ReleaseDetailWrapper
            v-if="$screen.isMultiColumn"
            :release="release"
            :class="$style.Detail"
          />
        </div>
      </div>
    </div>

    <TrackTable
      :tracks="release.trackList"
      :uri="release.uri"
      :class="$style.ReleaseIdPage__table"
      @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
    />

    <IntersectionLoadingCircle
      :loading="release.hasNextTrack"
      @appear="appendTrackList"
    />

    <Copyrights
      :copyrights="release.copyrightList"
      :class="$style.ReleaseIdPage__copyrights"
    />

    <ReleaseDetailWrapper
      v-if="$screen.isSingleColumn"
      :release="release"
      :class="$style.Detail"
    />

    <template v-for="artist in release.artistReleaseList">
      <ScrollableCardsSection
        v-if="artist.items.length > 0"
        :key="artist.id"
        :title="`${artist.name}の他のリリース`"
        :class="$style.ReleaseIdPage__section"
      >
        <ReleaseCard
          v-for="release in artist.items"
          :key="release.id"
          :item="release"
          :width="$screen.cardWidth"
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
import type { Context } from '@nuxt/types';
import type { RootState, ExtendedMutationPayload } from 'typed-vuex';

import type { SpotifyAPI, OneToFifty } from 'shared/types';
import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseMenu, { On as OnMenu } from '~/components/parts/menu/ReleaseMenu.vue';
import ReleaseDetailWrapper from '~/components/parts/wrapper/ReleaseDetailWrapper.vue';
import TrackTable, { On as OnTable } from '~/components/containers/table/TrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import Fallback from '~/components/parts/utils/Fallback.vue';

import { getRelease } from '~/services/local/_releaseId';
import { checkTrackSavedState } from '~/utils/subscriber';
import { getImageSrc, convertTrackDetail } from '~/services/converter';
import type { App } from '~/entities';

const HEADER_REF = 'HEADER_REF';
const LIMIT_OF_TRACKS = 30;

interface AsyncData {
  release: App.ReleasePage | undefined;
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined;
  HEADER_REF: string;
}

@Component({
  components: {
    ReleaseArtwork,
    HashTags,
    ArtistNames,
    ContextMediaButton,
    FavoriteButton,
    ReleaseMenu,
    ReleaseDetailWrapper,
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
    const release = await getRelease(context);
    return {
      release,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData, Data {
  release: App.ReleasePage | undefined = undefined;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.release?.name ?? 'エラー',
    };
  }

  get artworkSrc(): string | undefined {
    return getImageSrc(this.release?.images, this.$constant.ARTWORK_BASE_SIZE);
  }
  get isReleaseSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.release?.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.release != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    // 小さい画像から抽出
    const artworkSrc = getImageSrc(this.release?.images, 40);
    if (artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', artworkSrc);
    } else {
      this.$dispatch('setDefaultDominantBackgroundColor');
    }

    const subscribeTrack = (mutationPayload: ExtendedMutationPayload<'library/tracks/SET_ACTUAL_IS_SAVED'>) => {
      if (this.release == null) return;
      const trackList = checkTrackSavedState<App.TrackDetail>(
        mutationPayload,
        this.$commit,
      )(this.release.trackList);
      this.release = {
        ...this.release,
        trackList,
      };
    };

    const subscribeRelease = ({ payload: [releaseId, isSaved] }: ExtendedMutationPayload<'library/releases/SET_ACTUAL_IS_SAVED'>) => {
      if (this.release == null) return;
      if (releaseId === this.release.id) {
        this.release.isSaved = isSaved;
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
    if (this.release == null || !this.release.hasNextTrack) return;

    const currentRelease = this.release;
    const releaseId = currentRelease.id;
    const offset = this.release.trackList.length;
    const tracks = await this.$spotify.albums.getAlbumTracks({
      albumId: releaseId,
      limit,
      offset,
    });
    if (tracks == null) {
      this.$toast.pushError('トラックが取得できませんでした。');
      this.release = {
        ...currentRelease,
        hasNextTrack: false,
      };
      return;
    }

    const trackIdList = tracks.items.map((track) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = tracks.items.map(convertTrackDetail<SpotifyAPI.SimpleTrack>({
      isTrackSavedList,
      offset,
      releaseId,
      releaseName: currentRelease.name,
      artistIdList: currentRelease.artists.map((artist) => artist.id),
      images: currentRelease.images,
    }));
    const durationMs = trackList.reduce((prev, curr) => prev + curr.durationMs, 0);
    this.release = {
      ...currentRelease,
      trackList: [...currentRelease.trackList, ...trackList],
      durationMs: currentRelease.durationMs + durationMs,
      hasNextTrack: tracks.next != null,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnFavorite['input']) {
    if (this.release == null) return;

    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('playback/play', this.isReleaseSet
        ? undefined
        : { context: this.release.uri });
    } else {
      this.$dispatch('playback/pause');
    }
  }

  toggleSavedState(nextSavedState: OnMediaButton['input'] | OnMenu['on-favorite-menu-clicked']) {
    if (this.release == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.release.isSaved = nextSavedState;
    const releaseIdList = [this.release.id];
    if (nextSavedState) {
      this.$dispatch('library/releases/saveReleases', releaseIdList);
    } else {
      this.$dispatch('library/releases/removeReleases', releaseIdList);
    }
  }

  onFavoriteTrackButtonClicked({ index, id, isSaved }: OnTable['on-favorite-button-clicked']) {
    if (this.release == null) return;

    const nextSavedState = !isSaved;
    const currentRelease = this.release;
    const trackList = [...currentRelease.trackList];
    trackList[index].isSaved = nextSavedState;
    this.release = {
      ...currentRelease,
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
.Fab {
  @include global-fab();
}

$margin-bottom: 32px;

.ReleaseIdPage {
  @include page-margin();
  @include page-padding();

  &__header {
    @include page-header();

    margin-bottom: $margin-bottom / 2;
  }

  &__table {
    margin-bottom: $margin-bottom / 2;
  }

  &__copyrights,
  &__section {
    margin-bottom: $margin-bottom;
  }
}

.Info {
  @include page-info();

  &__hashTags {
    // border-radius の分だけ右にあるように見えてしまうので調整
    margin-left: -8px;
    margin-bottom: 12px;
  }

  &__title {
    @include page-title();
  }

  &__artists {
    display: flex;
    flex-wrap: wrap;

    @include smaller-than-md() {
      // 複数行になってもセンタリングさせる
      justify-content: center;
    }
  }

  &__footer {
    margin-top: 16px;

    @include larger-than-md() {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
    }
  }

  &__buttons {
    @include page-header-buttons(true);
  }
}

.Detail {
  @include smaller-than-md() {
    margin-top: $margin-bottom / -2;
    margin-bottom: $margin-bottom;
  }

  @include larger-than-md() {
    // 2行になったとき
    margin-top: 12px;
  }
}
</style>
