<template>
  <main :class="$style.releaseIdPage">
    <div :class="$style.releaseIdPage__header">
      <ReleaseArtWork v-bind="releaseArtWorkInfo" />

      <div :class="$style.releaseIdPage__releaseInfo">
        <span :class="$style.releaseIdPage__releaseType">
          {{ albumType }}
        </span>

        <h1 :class="$style.releaseIdPage__releaseName">
          {{ name }}
        </h1>

        <artist-name :artist-list="artistList" />

        <div :class="$style.releaseIdPage__releaseDetail">
          <release-date
            :release-date="releaseDate"
            :release-date-precision="releaseDatePrecision" />
          <release-total-tracks
            :total-tracks="totalTracks" />
        </div>
      </div>
    </div>

    <div :class="$style.releaseIdPage__trackList">
      <track-list
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
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import TrackList from '~/components/parts/table/TrackList.vue';
import ArtistName, { Artists } from '~/components/parts/text/ArtistName.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import { SpotifyAPI } from '~~/types';

export type AsyncData = {
  albumType: 'アルバム' | 'シングル' | 'コンピレーション'
  artistList: Artists
  label: string
  name: string
  releaseDate: string
  releaseDatePrecision: string
  releaseArtWorkInfo: ReleaseArtWorkInfo
  tracks: SpotifyAPI.Album['tracks']
  totalTracks: number
  copyrightList: SpotifyAPI.Copyright[]
}

export default Vue.extend({
  name: 'ReleaseIdPage',
  components: {
    ReleaseArtWork,
    ArtistName,
    ReleaseDate,
    ReleaseTotalTracks,
    TrackList,
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

    return {
      albumType,
      artistList,
      label,
      name,
      releaseDate,
      releaseDatePrecision,
      releaseArtWorkInfo,
      tracks,
      totalTracks,
      copyrightList,
    };
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
    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
  &__releaseType {
    font-size: 10px;
  }
  &__releaseName {
    font-size: 44px;
  }
  &__releaseDetail {
    margin-top: 4px;
    & > *:not(:last-child) {
      margin-right: 12px;
    }
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
