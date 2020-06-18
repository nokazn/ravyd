<template>
  <div
    v-if="releaseInfo != null"
    :class="$style.ReleaseIdPage"
  >
    <div :class="$style.ReleaseIdPage__header">
      <ReleaseArtwork
        :src="releaseInfo.artworkSrc"
        :alt="releaseInfo.name"
        :size="artworkSize"
        :title="releaseInfo.name"
        shadow
      />

      <div :class="$style.ReleaseIdPage__info">
        <div class="g-small-text">
          {{ releaseInfo.releaseType }}
        </div>

        <h1 :class="$style.ReleaseIdPage__releaseName">
          {{ releaseInfo.name }}
        </h1>

        <ArtistNames :artist-list="releaseInfo.artistList" />

        <div :class="$style.ReleaseIdPage__releaseInfoFooter">
          <div :class="$style.ReleaseIdPage__buttons">
            <ContextMediaButton
              :is-playing="isReleaseSet && isPlaying"
              @on-clicked="onContextMediaButtonClicked"
            />

            <FavoriteButton
              :is-favorited="releaseInfo.isSaved"
              outlined
              @on-clicked="onFavoriteButtonClicked"
            />
          </div>

          <div :class="$style.ReleaseIdPage__releaseDetail">
            <ReleaseDate
              :release-date="releaseInfo.releaseDate"
              :release-date-precision="releaseInfo.releaseDatePrecision"
            />

            <ReleaseTotalTracks
              :total-tracks="releaseInfo.totalTracks"
            />

            <ReleaseDuration
              :duration-ms="releaseInfo.durationMs"
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
      :class="$style.ReleaseIdPage__trackTable"
      @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
    />

    <Copyrights
      :copyright-list="releaseInfo.copyrightList"
      :class="$style.ReleaseIdPage__copyrights"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, RootMutations } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import TrackTable, { On as OnTable } from '~/components/containers/table/TrackTable.vue';

import { getReleaseInfo, getReleaseTrackListHandler } from '~/scripts/localPlugins/_releaseId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_TRACKS = 50;

interface AsyncData {
  artworkSize: number
  releaseInfo: App.ReleaseInfo | undefined
  getReleaseTrackList: ReturnType<typeof getReleaseTrackListHandler> | undefined
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
}


@Component({
  components: {
    ReleaseArtwork,
    ArtistNames,
    ContextMediaButton,
    FavoriteButton,
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    ReleaseLabel,
    TrackTable,
    Copyrights,
  },

  validate({ params }: Context) {
    return params.releaseId !== '';
  },

  async asyncData(context: Context): Promise<AsyncData> {
    const artworkSize = ARTWORK_SIZE;
    const releaseInfo = await getReleaseInfo(context, artworkSize);
    const getReleaseTrackList = getReleaseTrackListHandler(context);

    return {
      artworkSize,
      releaseInfo,
      getReleaseTrackList,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData, Data {
  artworkSize = ARTWORK_SIZE
  releaseInfo: App.ReleaseInfo | undefined = undefined
  releaseTrackInfo: App.ReleaseTrackInfo | undefined = undefined
  getReleaseTrackList: ReturnType<typeof getReleaseTrackListHandler> | undefined = undefined

  mutationUnsubscribe: (() => void) | undefined = undefined

  head() {
    return {
      title: this.releaseInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    this.getReleaseTrackInfo();

    if (this.releaseInfo?.artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', this.releaseInfo.artworkSrc);
    }

    this.mutationUnsubscribe = this.$store.subscribe((mutation) => {
      if (this.releaseInfo == null) return;

      const type = mutation.type as keyof RootMutations;
      if (type !== 'library/tracks/SET_ACTUAL_IS_SAVED') return;

      const trackList = checkTrackSavedState<App.SimpleTrackDetail>(mutation as {
        type: typeof type
        payload: RootMutations[typeof type]
      }, this.$commit)(this.releaseInfo.trackList);

      this.releaseInfo = {
        ...this.releaseInfo,
        trackList,
      };
    });
  }

  beforeDestroy() {
    this.$dispatch('resetDominantBackgroundColor');

    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  async getReleaseTrackInfo() {
    if (this.releaseInfo == null
      || this.releaseInfo.isFullTrackList
      || this.getReleaseTrackList == null) {
      return;
    }

    const limit = LIMIT_OF_TRACKS;
    const offset = this.releaseInfo.trackList.length;
    const { totalTracks } = this.releaseInfo;
    const trackList = await this.getReleaseTrackList({
      limit,
      offset,
      totalTracks,
    });


    this.releaseInfo = {
      ...this.releaseInfo,
      trackList: [...this.releaseInfo.trackList, ...trackList],
      isFullTrackList: true,
    };
  }

  get isReleaseSet(): boolean {
    return this.$getters()['player/isContextSet'](this.releaseInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
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

  onFavoriteButtonClicked(nextSavedState: OnMediaButton['on-clicked']) {
    if (this.releaseInfo == null) return;

    this.releaseInfo.isSaved = nextSavedState;
    const releaseIdList = [this.releaseInfo.id];
    if (nextSavedState) {
      this.$dispatch('library/releases/saveReleases', releaseIdList);
    } else {
      this.$dispatch('library/releases/removeReleases', releaseIdList);
    }
  }

  onFavoriteTrackButtonClicked(row: OnTable['on-favorite-button-clicked']) {
    if (this.releaseInfo == null) return;

    const trackList = [...this.releaseInfo.trackList];
    trackList[row.index].isSaved = !row.isSaved;
    this.releaseInfo = {
      ...this.releaseInfo,
      trackList,
    };
  }
}
</script>

<style lang="scss" module>
.ReleaseIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: flex;
    margin-bottom: 32px;

    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__releaseName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }

  &__releaseInfoFooter {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-top: 12px;
  }

  &__buttons {
    margin-right: 24px;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }

  &__releaseDetail {
    margin-top: 12px;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }

  &__trackTable {
    margin-bottom: 16px;
  }
}
</style>
