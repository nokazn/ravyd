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
      v-if="releaseInfo != null"
      :ref="HEADER_REF"
      :class="$style.ReleaseIdPage__header"
    >
      <ReleaseArtwork
        :src="releaseInfo.artworkSrc"
        :alt="releaseInfo.name"
        :size="ARTWORK_SIZE"
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

        <h1 :class="$style.Info__releaseName">
          {{ releaseInfo.name }}
        </h1>

        <ArtistNames :artist-list="releaseInfo.artistList" />

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
              :total-tracks="releaseInfo.totalTracks"
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

    <Copyrights :copyright-list="releaseInfo.copyrightList" />

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
          :width="CARD_WIDTH"
          discograpy
        />
      </ScrollableCardsSection>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, ExtendedMutationPayload } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import HashTags from '~/components/parts/chip/HashTags.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseMenu, { On as OnMenu } from '~/components/containers/menu/ReleaseMenu.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import TrackTable, { On as OnTable } from '~/components/containers/table/TrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import ScrollableCardsSection from '~/components/parts/section/ScrollableCardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';

import { getReleaseInfo } from '~/scripts/localPlugins/_releaseId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { convertTrackDetail } from '~/scripts/converter/convertTrackDetail';
import { SpotifyAPI, App } from '~~/types';

const ARTWORK_SIZE = 220;
const CARD_WIDTH = 200;
const HEADER_REF = 'HEADER_REF';

interface AsyncData {
  releaseInfo: App.ReleaseInfo | undefined
  ARTWORK_SIZE: number
  CARD_WIDTH: number
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
  },

  validate({ params }: Context) {
    return params.releaseId !== '';
  },

  async asyncData(context: Context): Promise<AsyncData> {
    const releaseInfo = await getReleaseInfo(context, ARTWORK_SIZE);

    return {
      releaseInfo,
      ARTWORK_SIZE,
      CARD_WIDTH,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData, Data {
  releaseInfo: App.ReleaseInfo | undefined = undefined;
  releaseTrackInfo: App.ReleaseTrackInfo | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;
  CARD_WIDTH = CARD_WIDTH;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  HEADER_REF = HEADER_REF;

  head() {
    return {
      title: this.releaseInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    // ボタンが見えなくなったらヘッダーに表示
    if (this.releaseInfo != null) {
      const ref = this.$refs[HEADER_REF] as HTMLDivElement;
      this.$header.observe(ref);
    }

    if (this.releaseInfo?.artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', this.releaseInfo.artworkSrc);
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

  get isReleaseSet(): boolean {
    return this.$getters()['player/isContextSet'](this.releaseInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  async appendTrackList() {
    if (this.releaseInfo == null
      || this.releaseInfo.isFullTrackList) {
      return;
    }

    const { releaseInfo } = this;
    const offset = this.releaseInfo.trackList.length;
    const tracks = await this.$spotify.albums.getAlbumTracks({
      albumId: this.$route.params.releaseId,
      market: this.$getters()['auth/userCountryCode'],
      limit: 50,
      offset,
    });
    if (tracks == null) {
      this.$toast.show('error', 'トラックが取得できませんでした。');
      this.releaseInfo = { ...this.releaseInfo, isFullTrackList: true };
      return;
    }

    const trackIdList = tracks.items.map((track) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({ trackIdList });
    const trackList = tracks.items.map((track, i) => {
      const detail = convertTrackDetail<SpotifyAPI.SimpleTrack>({
        isTrackSavedList,
        offset,
        releaseId: releaseInfo.id,
        releaseName: releaseInfo.name,
        artistIdList: releaseInfo.artistList.map((artist) => artist.id),
        artworkSrc: releaseInfo.artworkSrc,
      })(track, i);

      return detail;
    });
    const durationMs = trackList.reduce((prev, curr) => prev + curr.durationMs, 0);
    const isFullTrackList = tracks.next == null;

    this.releaseInfo = {
      ...this.releaseInfo,
      trackList: [...this.releaseInfo.trackList, ...trackList],
      durationMs: this.releaseInfo.durationMs + durationMs,
      isFullTrackList,
    };
  }

  onContextMediaButtonClicked(nextPlayingState: OnFavorite['on-clicked']) {
    if (this.releaseInfo == null) return;

    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('player/play', this.isReleaseSet
        ? undefined
        : { contextUri: this.releaseInfo.uri });
    } else {
      this.$dispatch('player/pause');
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
    const trackList = [...this.releaseInfo.trackList];
    trackList[index].isSaved = nextSavedState;
    this.releaseInfo = {
      ...this.releaseInfo,
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
  padding: 16px 6% 48px;

  &__header {
    display: grid;
    grid-template-columns: 220px auto;
    grid-column-gap: 24px;
    margin-bottom: 32px;
  }

  .Info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &__hashTags {
      // border-radius の分だけ右にあるように見えてしまうので調整
      margin-left: -8px;
      margin-bottom: 12px;
    }

    &__releaseName {
      font-size: 40px;
      margin: 8px 0;
      line-height: 1.2em;
    }

    &__footer {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      margin-top: 12px;
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
    margin-bottom: 16px;
  }

  &__section {
    margin: 40px -32px 0;
  }
}
</style>
