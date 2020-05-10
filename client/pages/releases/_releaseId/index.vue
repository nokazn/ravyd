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
import Vue from 'vue';

import ReleaseArtWork, { ReleaseArtWorkInfo } from '~/components/parts/avatar/ReleaseArtWork.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import FavoriteButton from '~/components/parts/button/FavoriteButton.vue';
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import TrackListTable from '~/components/parts/table/TrackListTable.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import { SpotifyAPI } from '~~/types';

export type AsyncData = {
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
  copyrightList: SpotifyAPI.Copyright[]
  isFavorited: boolean
}

export default Vue.extend({
  name: 'ReleaseIdPage',
  components: {
    ReleaseArtWork,
    ArtistName,
    FavoriteButton,
    ReleaseDate,
    ReleaseTotalTracks,
    TrackListTable,
    Copyrights,
  },

  validate({ params }) {
    console.log(params);
    return params.releaseId !== '';
  },

  async asyncData({ app, params }): Promise<AsyncData | null> {
    const release: SpotifyAPI.Album = await app.$spotifyApi.$get(`/albums/${params.releaseId}`)
      .catch((err: Error) => {
        console.error(err);
        return null;
      });
    if (release == null) return null;

    console.log(release);
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
      copyrightList,
      isFavorited,
    };
  },

  methods: {
    async onFavoriteButtonClicked(isFavorited: boolean) {
      this.isFavorited = isFavorited;
      if (isFavorited) {
        await this.$spotifyApi.$put('/me/albums', null, {
          params: {
            ids: this.id,
          },
        }).catch((err: Error) => {
          console.error({ err });
          this.isFavorited = !isFavorited;
        });
      } else {
        await this.$spotifyApi.$delete('/me/albums', {
          params: {
            ids: this.id,
          },
        }).catch((err: Error) => {
          console.error({ err });
          this.isFavorited = !isFavorited;
        });
      }
    },
  },
});
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
