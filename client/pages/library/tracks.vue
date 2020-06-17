<template>
  <div :class="$style.LibraryTracksPage">
    <h1
      :class="$style.LibraryTracksPage__title"
      v-text="title"
    />

    <ContextMediaButton
      :is-playing="isPlaylistSet && isPlaying"
      @on-clicked="onContextMediaButtonClicked"
    />

    <PlaylistTrackTable
      v-if="trackList != null"
      v-bind="trackTableInfo"
      :class="$style.LibraryTracksPage__table"
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

import ContextMediaButton, { On } from '~/components/parts/button/ContextMediaButton.vue';
import PlaylistTrackTable from '~/components/containers/table/PlaylistTrackTable.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { generateCollectionContextUri } from '~/scripts/text/generateCollectionContextUri';
import { App } from '~~/types';

interface Data {
  observer: IntersectionObserver | undefined
  title: string
  trackTableInfo: {
    trackList: App.PlaylistTrackDetail[] | null
    uri: string
    custom: true
  }
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
      await app.$dispatch('library/tracks/getSavedTrackList', { limit: LIMIT_OF_TRACKS });
    } else {
      await app.$dispatch('library/tracks/updateLatestSavedTrackList');
    }
    app.$dispatch('library/tracks/removeUnsavedTracks');
  },
})
export default class LibraryTracksPage extends Vue implements Data {
  observer: IntersectionObserver | undefined = undefined
  title = 'お気に入りの曲'
  trackTableInfo = {
    trackList: this.trackList,
    // @non-null ログイン中なので userId は必ず存在
    uri: generateCollectionContextUri(this.$getters()['auth/userId']!),
    // uri は指定するが、contextUri をパラメータとして送信しない
    custom: true as const,
  }

  head() {
    return {
      title: this.title,
    };
  }

  get trackList(): App.PlaylistTrackDetail[] | null {
    return this.$state().library.tracks.trackList;
  }
  get isFullTrackList(): boolean {
    return this.$state().library.tracks.isFullTrackList;
  }
  get isPlaylistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.trackTableInfo.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  mounted() {
    this.$dispatch('setDefaultDominantBackgroundColor');
  }
  beforeDestroy() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  onContextMediaButtonClicked(nextPlayingState: On['on-clicked']) {
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
      contextUri: this.trackTableInfo.uri,
      trackUriList,
    });
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

  &__loading {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
