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
  observer: IntersectionObserver | undefined
  title: string
  uri: string
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
  observer: IntersectionObserver | undefined = undefined;
  title = 'お気に入りの曲';
  // @non-null ログイン中なので userId は必ず存在
  uri = generateCollectionContextUri(this.$getters()['auth/userId']!);

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
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    // 停止
    if (!nextPlayingState) {
      this.$dispatch('player/pause');
      return;
    }

    if (this.trackList == null) return;

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

  &__loading {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
