<template>
  <div :class="$style.LibraryTracksPage">
    <ContextMediaButton
      :ref="MEDIA_BUTTON_REF"
      :value="isPlaylistSet && isPlaying"
      @input="onContextMediaButtonClicked"
    />

    <PlaylistTrackTable
      v-if="trackList != null"
      custom
      :tracks="trackList"
      :uri="uri"
      :class="$style.LibraryTracksPage__table"
      @on-favorite-button-clicked="onFavoriteButtonClicked"
    />

    <IntersectionLoadingCircle
      :loading="!isFull"
      @appear="onLoadingCircleAppear"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { generateUserContextUri } from '~/services/converter';
import type { App } from '~/entities';

interface AsyncData {
  uri: string | undefined;
}

interface Data {
  observer: IntersectionObserver | undefined;
  mutationUnsubscribe: (() => void) | undefined;
  MEDIA_BUTTON_REF: string;
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

  async asyncData({ app }) {
    return {
      uri: generateUserContextUri(app.$getters()['auth/userId'], 'collection'),
    };
  },

  head() {
    return {
      title: 'お気に入りの曲',
    };
  },
})
export default class LibraryTracksPage extends Vue implements AsyncData, Data {
  uri: string | undefined;
  observer: IntersectionObserver | undefined = undefined;
  mutationUnsubscribe: (() => void) | undefined = undefined;
  MEDIA_BUTTON_REF = MEDIA_BUTTON_REF;

  get trackList(): App.PlaylistTrackDetail[] {
    return this.$getters()['library/tracks/trackList'];
  }
  get isFull(): boolean {
    return this.$getters()['library/tracks/isFull'];
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['playback/isContextSet'](this.uri);
  }
  get isPlaying(): boolean {
    return this.$getters()['playback/isPlaying'];
  }

  mounted() {
    const element = this.$refs[MEDIA_BUTTON_REF] as Vue;
    const TAB_HEIGHT = 80;
    this.$header.observe(element.$el, this.$constant.HEADER_HEIGHT + TAB_HEIGHT);

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

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['input']) {
    // 停止
    if (!nextPlayingState) {
      this.$dispatch('playback/pause');
      return;
    }
    if (this.trackList == null || this.trackList.length === 0) return;
    const context = this.trackList.map((track) => track.uri);
    // uri を contextUri に指定しても再生できないため uris で指定
    this.$dispatch('playback/play', this.isPlaylistSet
      ? undefined
      : { context });
    this.$dispatch('playback/setCustomContext', {
      contextUri: this.uri,
      trackUriList: context,
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
  @include page-padding(0.375);

  & > * {
    margin-bottom: 8px;
  }

  &__table {
    margin-bottom: 24px;
  }
}
</style>
