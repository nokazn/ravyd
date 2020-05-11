<template>
  <main :class="$style.releaseIdPage">
    <div :class="$style.releaseIdPage__header">
      <ReleaseArtWork v-bind="releaseArtWorkInfo" />

      <div :class="$style.releaseIdPage__releaseInfo">
        <div :class="$style.releaseIdPage__releaseType">
          {{ albumType }}
        </div>

        <h1 :class="$style.releaseIdPage__releaseName">
          {{ name }}
        </h1>

        <artist-name
          :artist-list="artistList"
          :class="$style.releaseIdPage__artistsName" />

        <div :class="$style.releaseIdPage__releaseDetail">
          <release-date
            :release-date="releaseDate"
            :release-date-precision="releaseDatePrecision" />

          <release-total-tracks
            :total-tracks="totalTracks" />

          <release-duration
            :duration-ms="durationMs" />
        </div>

        <div :class="$style.ReleaseIdPage__buttons">
          <favorite-button
            :is-favorited="isFavorited"
            outlined
            @on-clicked="onFavoriteButtonClicked" />
        </div>
      </div>
    </div>

    <div :class="$style.releaseIdPage__trackList">
      <track-list-table
        :track-list="tracks.items" />

      <copyrights
        :copyright-list="copyrightList"
        :class="$style.releaseIdPage__copyrights" />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';

import ReleaseArtWork, { ReleaseArtWorkInfo } from '~/components/parts/avatar/ReleaseArtWork.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import TrackListTable from '~/components/parts/table/TrackListTable.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import { SpotifyAPI } from '~~/types';

export interface AsyncData {
  albumType: 'アルバム' | 'シングル' | 'コンピレーション'
  artistList: Artists
  label: string
  name: string
  id: string
  releaseDate: string
  releaseDatePrecision: string
  releaseArtWorkInfo: ReleaseArtWorkInfo
  tracks: SpotifyAPI.Album['tracks']
  totalTracks: number
  durationMs: number
  copyrightList: SpotifyAPI.Copyright[]
  isFavorited: boolean
}

@Component({
  components: {
    ReleaseArtWork,
    ArtistName,
    FavoriteButton,
    ReleaseDate,
    ReleaseTotalTracks,
    ReleaseDuration,
    TrackListTable,
    Copyrights,
  },
  validate({ params }: Context) {
    console.log(params);
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
      release_date: releaseDate,
      release_date_precision: releaseDatePrecision,
      tracks,
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

    const durationMs = tracks.items.reduce((prev, track) => track.duration_ms + prev, 0);

    const [isFavorited]: [boolean] = await app.$spotifyApi.$get('/me/albums/contains', {
      params: {
        ids: id,
      },
    }).catch((err) => {
      console.error({ err });
      return false;
    });

    return {
      albumType,
      artistList,
      label,
      name,
      id,
      releaseDate,
      releaseDatePrecision,
      releaseArtWorkInfo,
      tracks,
      totalTracks,
      durationMs,
      copyrightList,
      isFavorited,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData {
  albumType: 'アルバム' = 'アルバム'
  artistList = []
  label = ''
  name = ''
  id = ''
  releaseDate = ''
  releaseDatePrecision = ''
  releaseArtWorkInfo = {} as ReleaseArtWorkInfo
  tracks = {} as SpotifyAPI.Album['tracks']
  totalTracks = 0
  durationMs = 0
  copyrightList = []
  isFavorited = false

  async onFavoriteButtonClicked(isFavorited: boolean) {
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

    this.isFavorited = isFavorited;
    await handler().catch((err: Error) => {
      console.error({ err });
    });
  }
}
</script>

<style lang="scss" module>
.releaseIdPage {
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
    margin: -6px 0;
  }
  &__artistsName {
    margin-bottom: 4px;
  }
  &__releaseDetail {
    margin-bottom: 8px;
    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }

  &__buttons > *:not(:last-child) {
    margin-right: 12px;
  }

  &__trackList {
    & > *:not(:last-child) {
      margin-bottom: 28px;
    }
  }
  &__copyrights {
    padding-left: 16px;
  }
}
</style>
