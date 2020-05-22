<template>
  <main :class="$style.ReleaseIdPage">
    <div :class="$style.ReleaseIdPage__header">
      <ReleaseArtWork v-bind="releaseArtWorkInfo" />

      <div :class="$style.ReleaseIdPage__releaseInfo">
        <div :class="$style.ReleaseIdPage__releaseType">
          {{ albumType }}
        </div>

        <h1 :class="$style.ReleaseIdPage__releaseName">
          {{ name }}
        </h1>

        <artist-name
          :artist-list="artistList"
          :class="$style.ReleaseIdPage__artistsName" />

        <div :class="$style.ReleaseIdPage__releaseInfoFooter">
          <div :class="$style.ReleaseIdPage__buttons">
            <media-control-button
              :is-playing="isPlaying && isAlbumSet"
              @on-clicked="onMediaControlButtonClicked" />

            <favorite-button
              :is-favorited="isFavorited"
              outlined
              @on-clicked="onFavoriteButtonClicked" />
          </div>

          <div :class="$style.ReleaseIdPage__releaseDetail">
            <release-date
              :release-date="releaseDate"
              :release-date-precision="releaseDatePrecision" />

            <release-total-tracks
              :total-tracks="totalTracks" />

            <release-duration
              :duration-ms="durationMs" />

            <release-label
              :label="label" />
          </div>
        </div>
      </div>
    </div>

    <track-list-table
      :track-list="trackList"
      :is-track-favorited-list="isTrackFavoritedList"
      :uri="uri"
      :class="$style.ReleaseIdPage__trackList" />

    <copyrights
      :copyright-list="copyrightList"
      :class="$style.ReleaseIdPage__copyrights" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';

import ReleaseArtWork, { ReleaseArtWorkInfo } from '~/components/parts/avatar/ReleaseArtWork.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import MediaControlButton from '~/components/parts/button/MediaControlButton.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import TrackListTable from '~/components/containers/table/TrackListTable.vue';
import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { SpotifyAPI } from '~~/types';

export interface AsyncData {
  albumType: 'アルバム' | 'シングル' | 'コンピレーション'
  artistList: Artists
  label: string
  name: string
  id: string
  uri: string
  releaseDate: string
  releaseDatePrecision: string
  releaseArtWorkInfo: ReleaseArtWorkInfo
  trackList: SpotifyAPI.SimpleTrack[]
  isTrackFavoritedList: boolean[]
  totalTracks: number
  durationMs: number
  copyrightList: SpotifyAPI.Copyright[]
  isFavorited: boolean
}

@Component({
  components: {
    ReleaseArtWork,
    ArtistName,
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

  async asyncData({ app, params }: Context): Promise<AsyncData | null> {
    const release = await app.$spotify.albums.getAlbum({ albumId: params.releaseId });
    if (release == null) return null;

    const {
      album_type,
      artists,
      label,
      name,
      id,
      uri,
      release_date: releaseDate,
      release_date_precision: releaseDatePrecision,
      tracks: {
        items: trackList,
      },
      total_tracks: totalTracks,
      images,
      copyrights: copyrightList,
    } = release;

    const albumType = {
      album: 'アルバム' as const,
      single: 'シングル' as const,
      compilation: 'コンピレーション' as const,
    }[album_type];

    const artistList = artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    }));

    const artworkSize = 220;
    const releaseArtWorkInfo: ReleaseArtWorkInfo = {
      src: getImageSrc(images, artworkSize),
      alt: `the artwork of ${name} by ${artistList.map((artist) => artist.name).join(', ')}`,
      size: artworkSize,
    };

    // @todo 50 トラック超えた時
    const getIsFaboritedTrackList = app.$spotify.library.checkUserSavedTracks({
      trackIdList: trackList.map((track) => track.id),
    });
    const getIsFavorited = app.$spotify.library.checkUserSavedAlbums({
      albumIdList: [id],
    });
    const [isTrackFavoritedList, [isFavorited]] = await Promise.all([
      getIsFaboritedTrackList,
      getIsFavorited,
    ]);

    const durationMs = trackList.reduce((prev, track) => track.duration_ms + prev, 0);

    return {
      albumType,
      artistList,
      label,
      name,
      id,
      uri,
      releaseDate,
      releaseDatePrecision,
      releaseArtWorkInfo,
      trackList,
      isTrackFavoritedList,
      totalTracks,
      durationMs,
      copyrightList,
      isFavorited,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData {
  albumType: 'アルバム' = 'アルバム'
  artistList: SpotifyAPI.Artist[] = []
  label = ''
  name = ''
  id = ''
  uri = ''
  releaseDate = ''
  releaseDatePrecision = ''
  releaseArtWorkInfo: ReleaseArtWorkInfo = {
    src: '',
    alt: '',
  }
  trackList: SpotifyAPI.SimpleTrack[] = []
  isTrackFavoritedList: boolean[] = []
  totalTracks = 0
  durationMs = 0
  copyrightList = []
  isFavorited = false

  head() {
    return {
      title: this.name,
    };
  }

  get isPlaying(): boolean {
    return this.$state().player.isPlaying;
  }

  get isAlbumSet(): boolean {
    return this.$getters()['player/isAlbumSet'](this.id);
  }

  onFavoriteButtonClicked(nextIsFavorited: boolean) {
    this.isFavorited = nextIsFavorited;
    const albumIdList = [this.id];
    if (nextIsFavorited) {
      this.$spotify.library.saveAlbums({ albumIdList });
    } else {
      this.$spotify.library.removeUserSavedAlbums({ albumIdList });
    }
  }

  onMediaControlButtonClicked(nextPlayingState: boolean) {
    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('player/play', this.isAlbumSet
        ? undefined
        : { contextUri: this.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }
}
</script>

<style lang="scss" module>
.ReleaseIdPage {
  padding: 16px 6% 32px;
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
    line-height: 1.1em;
  }

  &__artistsName {
    font-size: 16px;
    margin-bottom: 16px;
  }

  &__releaseInfoFooter {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
    & > *:last-child {
      margin-top: 8px;
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
