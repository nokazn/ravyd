<template>
  <main
    v-if="releaseInfo != null"
    :class="$style.ReleaseIdPage"
    :style="styles">
    <div :class="$style.ReleaseIdPage__header">
      <release-artwork
        :src="releaseInfo.artworkSrc"
        :alt="releaseInfo.name"
        :size="220"
        :title="releaseInfo.name"
        shadow />

      <div :class="$style.ReleaseIdPage__releaseInfo">
        <div :class="$style.ReleaseIdPage__releaseType">
          {{ releaseInfo.albumType }}
        </div>

        <h1 :class="$style.ReleaseIdPage__releaseName">
          {{ releaseInfo.name }}
        </h1>

        <artist-names
          :artist-list="releaseInfo.artistList"
          :class="$style.ReleaseIdPage__artistsName" />

        <div :class="$style.ReleaseIdPage__releaseInfoFooter">
          <div :class="$style.ReleaseIdPage__buttons">
            <media-control-button
              :is-playing="isPlaying && isAlbumSet"
              @on-clicked="onMediaControlButtonClicked" />

            <favorite-button
              :is-favorited="releaseInfo.isSaved"
              outlined
              @on-clicked="onFavoriteButtonClicked" />
          </div>

          <div :class="$style.ReleaseIdPage__releaseDetail">
            <release-date
              :release-date="releaseInfo.releaseDate"
              :release-date-precision="releaseInfo.releaseDatePrecision" />

            <release-total-tracks
              :total-tracks="releaseInfo.totalTracks" />

            <release-duration
              :duration-ms="releaseInfo.durationMs" />

            <release-label
              :label="releaseInfo.label" />
          </div>
        </div>
      </div>
    </div>

    <track-list-table
      :track-list="releaseInfo.trackList"
      :uri="releaseInfo.uri"
      :class="$style.ReleaseIdPage__trackList" />

    <copyrights
      :copyright-list="releaseInfo.copyrightList"
      :class="$style.ReleaseIdPage__copyrights" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootGetters } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import MediaControlButton from '~/components/parts/button/MediaControlButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import TrackListTable from '~/components/containers/table/TrackListTable.vue';
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
    MediaControlButton,
    FavoriteButton,
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    ReleaseLabel,
    TrackListTable,
    Copyrights,
  },

  validate({ params }: Context) {
    return params.releaseId !== '';
  },

  async asyncData(context: Context): Promise<AsyncData | null> {
    const artworkSize = 220;
    const releaseInfo = await getReleaseInfo(context, artworkSize);

    if (releaseInfo != null) {
      context.app.$dispatch('extractDominantBackgroudColor', releaseInfo.artworkSrc);
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

  onFavoriteButtonClicked(nextSavedState: boolean) {
    if (this.releaseInfo == null) return;

    this.releaseInfo.isSaved = nextSavedState;
    const albumIdList = [this.releaseInfo.id];
    if (nextSavedState) {
      this.$spotify.library.saveAlbums({ albumIdList });
    } else {
      this.$spotify.library.removeUserSavedAlbums({ albumIdList });
    }
  }

  onMediaControlButtonClicked(nextPlayingState: boolean) {
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
    margin-bottom: 24px;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }

  &__releaseInfo {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__releaseType {
    font-size: 10px;
  }

  &__releaseName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }

  &__artistsName {
    font-size: 16px;
    margin-bottom: 12px;
  }

  &__releaseInfoFooter {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
    & > *:last-child {
      margin-top: 12px;
    }
  }
  &__buttons > *:not(:last-child) {
    margin-right: 12px;
  }
  &__releaseDetail > *:not(:last-child) {
    margin-right: 8px;
  }

  &__trackList {
    margin-bottom: 16px;
  }
}
</style>
