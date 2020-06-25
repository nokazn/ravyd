<template>
  <div
    v-if="releaseInfo != null"
    :class="$style.ReleaseIdPage"
  >
    <div :class="$style.ReleaseIdPage__header">
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
              @on-clicked="onFavoriteButtonClicked"
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

    <div :class="$style.ReleaseIdPage__progressCircular">
      <v-progress-circular
        v-if="!releaseInfo.isFullTrackList"
        indeterminate
      />
    </div>

    <Copyrights :copyright-list="releaseInfo.copyrightList" />
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
import ReleaseDate from '~/components/parts/text/ReleaseDate.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import ReleaseLabel from '~/components/parts/text/ReleaseLabel.vue';
import Copyrights from '~/components/parts/text/Copyrights.vue';
import TrackTable, { On as OnTable } from '~/components/containers/table/TrackTable.vue';

import { getReleaseInfo, getTrackListHandler } from '~/scripts/localPlugins/_releaseId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;

interface AsyncData {
  releaseInfo: App.ReleaseInfo | undefined
  getTrackList: ReturnType<typeof getTrackListHandler> | undefined
  ARTWORK_SIZE: number
}

interface Data {
  mutationUnsubscribe: (() => void) | undefined
}

@Component({
  components: {
    ReleaseArtwork,
    HashTags,
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
    const releaseInfo = await getReleaseInfo(context, ARTWORK_SIZE);
    const getTrackList = getTrackListHandler(context);

    return {
      releaseInfo,
      getTrackList,
      ARTWORK_SIZE,
    };
  },
})
export default class ReleaseIdPage extends Vue implements AsyncData, Data {
  releaseInfo: App.ReleaseInfo | undefined = undefined;
  releaseTrackInfo: App.ReleaseTrackInfo | undefined = undefined;
  getTrackList: ReturnType<typeof getTrackListHandler> | undefined = undefined;
  ARTWORK_SIZE = ARTWORK_SIZE;

  mutationUnsubscribe: (() => void) | undefined = undefined;

  head() {
    return {
      title: this.releaseInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    this.appendTrackList();

    if (this.releaseInfo?.artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', this.releaseInfo.artworkSrc);
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
        this.$commit('library/releases/DELETE_ACTUAL_IS_SAVED', releaseId);
      }
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
    this.$dispatch('resetDominantBackgroundColor');
    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  async appendTrackList() {
    if (this.releaseInfo == null
      || this.releaseInfo.isFullTrackList
      || this.getTrackList == null) {
      return;
    }

    const offset = this.releaseInfo.trackList.length;
    const counts = this.releaseInfo.totalTracks - offset;
    if (counts > 0) {
      const trackList = await this.getTrackList({
        offset,
        counts,
        releaseId: this.releaseInfo.id,
        releaseName: this.releaseInfo.name,
        artistIdList: this.releaseInfo.artistList.map((artist) => artist.id),
        artworkSrc: this.releaseInfo.artworkSrc,
      });

      this.releaseInfo = {
        ...this.releaseInfo,
        trackList: [...this.releaseInfo.trackList, ...trackList],
        isFullTrackList: true,
      };
    }
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

    // API との通信の結果を待たずに先に表示を変更させておく
    this.releaseInfo.isSaved = nextSavedState;
    const releaseIdList = [this.releaseInfo.id];
    if (nextSavedState) {
      this.$dispatch('library/releases/saveReleases', releaseIdList)
        .catch((err: Error) => {
          this.$toast.show('error', err.message);
        });
    } else {
      this.$dispatch('library/releases/removeReleases', releaseIdList)
        .catch((err: Error) => {
          this.$toast.show('error', err.message);
        });
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

  &__trackTable {
    margin-bottom: 16px;
  }

  &__progressCircular {
    display: flex;
    justify-content: center;
    margin: 12px 0;
    width: 100%;
  }
}
</style>
