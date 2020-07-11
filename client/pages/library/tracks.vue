<template>
  <div :class="$style.LibraryTracksPage">
    <h1 :class="$style.LibraryTracksPage__title">
      {{ title }}
    </h1>

    <ContextMediaButton
      :is-playing="isPlaylistSet && isPlaying"
      @on-clicked="onContextMediaButtonClicked"
    />

    <PlaylistTrackTable
      v-if="trackList != null"
      :track-list="trackList"
      :uri="uri"
      custom
      :class="$style.LibraryTracksPage__table"
      @on-favorite-button-clicked="onFavoriteButtonClicked"
    />

    <IntersectionLoadingCircle
      :is-loading="!isFullTrackList"
      @on-appeared="onLoadingCircleAppear"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState } from 'vuex';

import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { generateCollectionContextUri } from '~/scripts/text/generateCollectionContextUri';

interface Data {
  title: string
  uri: string
  observer: IntersectionObserver | undefined
  mutationSubscriber: (() => void) | undefined
}

const LIMIT_OF_TRACKS = 30 as const;

@Component({
  components: {
    ContextMediaButton,
    PlaylistTrackTable,
    IntersectionLoadingCircle,
  },

  async fetch({ app }): Promise<void> {
    if (app.$getters()['library/tracks/trackListLength'] === 0) {
      await app.$dispatch('library/tracks/getSavedTrackList', {
        limit: LIMIT_OF_TRACKS,
      }).catch((err: Error) => {
        console.error({ err });
        this.$toast.show('error', err.message);
      });
    } else {
      await app.$dispatch('library/tracks/updateLatestSavedTrackList')
        .catch((err: Error) => {
          console.error({ err });
          this.$toast.show('error', err.message);
        });
    }
    app.$dispatch('library/tracks/removeUnsavedTracks');
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  title = 'お気に入りの曲';
  // @non-null ログイン中なので userId は必ず存在
  uri = generateCollectionContextUri(this.$getters()['auth/userId']!);
  observer: IntersectionObserver | undefined = undefined;
  mutationSubscriber: (() => void) | undefined = undefined;

  head() {
    return {
      title: this.title,
    };
  }

  get trackList(): RootState['library']['tracks']['trackList'] {
    return this.$state().library.tracks.trackList;
  }
  get isFullTrackList(): RootState['library']['tracks']['isFullTrackList'] {
    return this.$state().library.tracks.isFullTrackList;
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  mounted() {
    this.$dispatch('setDefaultDominantBackgroundColor');

    this.mutationSubscriber = this.$subscribe((mutation) => {
      switch (mutation.type) {
        case 'library/tracks/INCREMENT_NUMBER_OF_UNUPDATED_TRACKS':
          this.$dispatch('library/tracks/updateLatestSavedTrackList');
          break;

        default:
          break;
      }
    });
  }

  beforeDestroy() {
    if (this.mutationSubscriber != null) {
      this.mutationSubscriber();
      this.mutationSubscriber = undefined;
    }
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    // 停止
    if (!nextPlayingState) {
      this.$dispatch('player/pause');
      return;
    }

    if (this.trackList == null || this.trackList.length === 0) return;

    // 再生
    const trackUriList = this.trackList.map((track) => track.uri);
    // uri を contextUri に指定しても再生できないため uris で指定
    this.$dispatch('player/play', this.isPlaylistSet
      ? undefined
      : { trackUriList });
    this.$dispatch('player/setCustomContext', {
      contextUri: this.uri,
      trackUriList,
    });
  }

  onFavoriteButtonClicked({ id, isSaved }: OnTable['on-favorite-button-clicked']) {
    const nextSavedState = !isSaved;
    if (nextSavedState) {
      this.$dispatch('library/tracks/saveTracks', [id]);
    } else {
      this.$dispatch('library/tracks/removeTracks', [id]);
    }
  }

  onLoadingCircleAppear() {
    this.$dispatch('library/tracks/getSavedTrackList', {
      limit: LIMIT_OF_TRACKS,
    }).catch((err: Error) => {
      console.error({ err });
      this.$toast.show('error', err.message);
    });
  }
}
</script>

<style lang="scss" module>
.LibraryTracksPage {
  padding: 16px 3% 48px;

  & > * {
    margin-bottom: 16px;
  }

  &__table {
    width: calc((100vw - #{$g-navigation-drawer-width}) * 0.94);
  }
}
</style>
