<template>
  <div
    v-if="releaseInfo != null"
    :class="$style.ReleaseIdPage"
    :style="styles"
  >
    <div :class="$style.ReleaseIdPage__header">
      <ReleaseArtwork
        :src="releaseInfo.artworkSrc"
        :alt="releaseInfo.name"
        :size="220"
        :title="releaseInfo.name"
        shadow
      />

      <div>
        <div class="g-small-text">
          {{ releaseInfo.albumType }}
        </div>

        <h1 :class="$style.ReleaseIdPage__releaseName">
          {{ releaseInfo.name }}
        </h1>

        <ArtistNames :artist-list="releaseInfo.artistList" />

        <div :class="$style.ReleaseIdPage__releaseInfoFooter">
          <div :class="$style.ReleaseIdPage__buttons">
            <ContextMediaButton
              :is-playing="isPlaying && isAlbumSet"
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
import { RootGetters } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavorite } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import TrackTable from '~/components/containers/table/TrackTable.vue';
import { getReleaseInfo } from '~/scripts/localPlugins/_releaseId';
import { App } from '~~/types';

export interface AsyncData {
  artworkSize: number
  releaseInfo: App.ReleaseInfo | null
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
    const artworkSize = 220;
    const releaseInfo = await getReleaseInfo(context, artworkSize);

    if (releaseInfo?.artworkSrc != null) {
      context.app.$dispatch('extractDominantBackgroundColor', releaseInfo.artworkSrc);
    }

    return {
      artworkSize,
      releaseInfo,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData {
  artworkSize = 220
  releaseInfo: App.ReleaseInfo | null = null

  head() {
    return {
      title: this.releaseInfo?.name ?? 'エラー',
    };
  }

  beforeDestroy() {
    this.$dispatch('resetBackgroundColor');
  }

  get styles(): RootGetters['backgroundStyles'] {
    return this.$getters().backgroundStyles;
  }
  get isPlaying(): boolean {
    return this.$state().player.isPlaying;
  }
  get isAlbumSet(): boolean {
    return this.releaseInfo != null
      ? this.$getters()['player/isAlbumSet'](this.releaseInfo.id)
      : false;
  }

  onFavoriteButtonClicked(nextSavedState: OnMediaButton['on-clicked']) {
    if (this.releaseInfo == null) return;

    this.releaseInfo.isSaved = nextSavedState;
    const albumIdList = [this.releaseInfo.id];
    if (nextSavedState) {
      this.$dispatch('library/releases/saveReleases', albumIdList);
    } else {
      this.$dispatch('library/releases/removeReleases', albumIdList);
    }
  }

  onContextMediaButtonClicked(nextPlayingState: OnFavorite['on-clicked']) {
    if (this.releaseInfo == null) return;

    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('player/play', this.isAlbumSet
        ? undefined
        : { contextUri: this.releaseInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }
}
</script>

<style lang="scss" module>
.ReleaseIdPage {
  padding: 16px 6% 48px;
  &__header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 32px;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
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
