<template>
  <div :class="$style.LibraryTracksPage">
    <portal :to="$header.PORTAL_NAME">
      <ContextMediaButton
        fab
        :height="32"
        :is-playing="isPlaylistSet && isPlaying"
        @on-clicked="onContextMediaButtonClicked"
      />
    </portal>

    <h1>
      {{ title }}
    </h1>

    <ContextMediaButton
      :ref="MEDIA_BUTTON_REF"
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
      :is-loading="!isFull"
      @on-appeared="onLoadingCircleAppear"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState, RootGetters } from 'typed-vuex';

import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { generateCollectionContextUri } from '~/scripts/text/generateCollectionContextUri';

interface Data {
  title: string
  uri: string
  observer: IntersectionObserver | undefined
  mutationUnsubscribe: (() => void) | undefined
  MEDIA_BUTTON_REF: string
}

const LIMIT_OF_TRACKS = 30 as const;
const MEDIA_BUTTON_REF = 'MEDIA_BUTTON_REF';

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
      });
    } else {
      await app.$dispatch('library/tracks/updateLatestSavedTrackList');
    }

    app.$dispatch('library/tracks/removeUnsavedTracks');
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  title = 'お気に入りの曲';
  // @non-null ログイン中なので userId は必ず存在
  uri = generateCollectionContextUri(this.$getters()['auth/userId']!);
  observer: IntersectionObserver | undefined = undefined;
  mutationUnsubscribe: (() => void) | undefined = undefined;
  MEDIA_BUTTON_REF = MEDIA_BUTTON_REF;

  head() {
    return {
      title: this.title,
    };
  }

  get trackList(): RootState['library']['tracks']['trackList'] {
    return this.$state().library.tracks.trackList;
  }
  get isFull(): RootGetters['library/tracks/isFull'] {
    return this.$getters()['library/tracks/isFull'];
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.uri);
  }
  get isPlaying(): RootState['playback']['isPlaying'] {
    return this.$state().playback.isPlaying;
  }

  mounted() {
    const element = this.$refs[MEDIA_BUTTON_REF] as Vue;
    this.$header.observe(element.$el);

    this.$dispatch('setDefaultDominantBackgroundColor');

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      switch (mutation.type) {
        case 'library/tracks/INCREMENT_UNUPDATED_COUNTS':
          this.$dispatch('library/tracks/updateLatestSavedTrackList');
          break;

        default:
          break;
      }
    });
  }

  beforeDestroy() {
    this.$header.disconnectObserver();

    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    // 停止
    if (!nextPlayingState) {
      this.$dispatch('playback/pause');
      return;
    }

    if (this.trackList == null || this.trackList.length === 0) return;

    // 再生
    const trackUriList = this.trackList.map((track) => track.uri);
    // uri を contextUri に指定しても再生できないため uris で指定
    this.$dispatch('playback/play', this.isPlaylistSet
      ? undefined
      : { trackUriList });
    this.$dispatch('playback/setCustomContext', {
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
