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
          </div>
        </div>
      </div>
    </div>

    <track-list-table
      :track-list="trackList"
      :is-track-favorited-list="isTrackFavoritedList"
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
import Copyrights from '~/components/parts/text/Copyrights.vue';

import TrackListTable from '~/components/containers/table/TrackListTable.vue';
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
    TrackListTable,
    Copyrights,
  },
  validate({ params }: Context) {
    return params.releaseId !== '';
  },
  async asyncData({ app, params }: Context): Promise<AsyncData | null> {
    const release: SpotifyAPI.Album | null = await app.$spotifyApi.$get(`/albums/${params.releaseId}`)
      .catch((err: Error) => {
        console.error(err);
        return null;
      });
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

    const releaseArtWorkInfo: ReleaseArtWorkInfo = {
      src: images[0].url,
      alt: `the artwork of ${name} by ${artistList.map((artist) => artist.name).join(', ')}`,
      size: 180,
    };

    const getIsFaboritedTrackList: Promise<boolean[]> = app.$spotifyApi.$get('/me/tracks/contains', {
      params: {
        ids: trackList.map((track) => track.id).join(','),
      },
    }).catch((err) => {
      console.error({ err });
      return new Array(trackList.length).fill(false);
    });
    const getIsFavorited = app.$spotifyApi.$get('/me/albums/contains', {
      params: {
        ids: id,
      },
    }).catch((err) => {
      console.error({ err });
      return [false];
    });
    // @todo 50 トラック超えた時
    const [
      isTrackFavoritedList,
      [isFavorited],
    ]: [
      boolean[],
      [boolean]
    ] = await Promise.all([
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

  get isPlaying() {
    return this.$state().player.isPlaying;
  }

  get isAlbumSet() {
    return this.$getters()['player/isAlbumSet'](this.id);
  }

  onFavoriteButtonClicked(isFavorited: boolean) {
    this.isFavorited = isFavorited;
    const handler = () => (isFavorited
      ? this.$spotifyApi.$put('/me/albums', null, {
        params: {
          ids: this.id,
        },
      })
      : this.$spotifyApi.$delete('/me/albums', {
        params: {
          ids: this.id,
        },
      }));
    handler().catch((err: Error) => {
      console.error({ err });
    });
  }

  onMediaControlButtonClicked(nextPlayingState: boolean) {
    if (nextPlayingState) {
      // 一時停止中のトラックが表示しているアルバムのものの場合は一時停止中のトラックをそのまま再生する
      const payload = this.isAlbumSet
        ? undefined
        : { contextUri: this.uri };
      this.$dispatch('player/play', payload);
    } else {
      this.$dispatch('player/pause');
    }
  }
}
</script>

<style lang="scss" module>
.ReleaseIdPage {
  padding: 32px 6%;
  &__header {
    display: flex;
    margin-bottom: 32px;
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
    font-size: 44px;
    margin-top: -4px;
  }

  &__artistsName {
    margin-bottom: 12px;
  }

  &__releaseInfoFooter {
    display: flex;
    align-items: flex-end;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }
  &__buttons > *:not(:last-child) {
    margin-right: 12px;
  }
  &__releaseDetail > *:not(:last-child) {
    margin-right: 12px;
  }

  &__trackList {
    margin-bottom: 20px;
  }
}
</style>
