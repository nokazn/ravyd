<template>
  <div
    v-if="playlistInfo != null"
    :class="$style.PlaylistIdPage"
  >
    <div :class="$style.PlaylistIdPage__header">
      <ReleaseArtwork
        :src="playlistInfo.artworkSrc"
        :alt="playlistInfo.name"
        :size="artworkSize"
        :title="playlistInfo.name"
        shadow
      />

      <div :class="$style.PlaylistIdPage__info">
        <div class="g-small-text">
          プレイリスト
        </div>

        <h1 :class="$style.PlaylistIdPage__playlistName">
          {{ playlistInfo.name }}
        </h1>

        <p
          class="subtext--text"
          v-html="playlistInfo.description"
        />

        <UserName :user="playlistInfo.owner" />

        <div :class="$style.PlaylistIdPage__playlistInfoFooter">
          <div :class="$style.PlaylistIdPage__buttons">
            <ContextMediaButton
              :is-playing="isPlaylistSet && isPlaying"
              @on-clicked="onContextMediaButtonClicked"
            />

            <FavoriteButton
              v-if="playlistInfo.isFollowing != null"
              :is-favorited="playlistInfo.isFollowing"
              outlined
              @on-clicked="onFollowButtonClicked"
            />
          </div>

          <div :class="$style.PlaylistIdPage__playlistDetail">
            <ReleaseTotalTracks
              :total-tracks="playlistInfo.totalTracks"
            />

            <ReleaseDuration
              :duration-ms="playlistInfo.durationMs"
            />

            <Followers
              :text="playlistInfo.followersText"
            />
          </div>
        </div>
      </div>
    </div>

    <PlaylistTrackTable
      v-if="playlistTrackInfo != null"
      :track-list="playlistTrackInfo.trackList"
      :uri="playlistInfo.uri"
      @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
    />

    <IntersectionLoadingCircle
      v-if="playlistTrackInfo != null"
      :is-loading="!playlistTrackInfo.isFullTrackList"
      @on-appeared="getTrackList"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState } from 'vuex';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import PlaylistTrackTable, { On as OnTable } from '~/components/containers/table/PlaylistTrackTable.vue';
import UserName from '~/components/parts/text/UserName.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFollowButton } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

import { getPlaylistInfo, getPlaylistTrackInfo } from '~/scripts/localPlugins/_playlistId';
import { convertPlaylistTrackDetail } from '~/scripts/converter/convertPlaylistTrackDetail';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;
const LIMIT_OF_TRACKS = 30;

interface AsyncData {
  artworkSize: typeof ARTWORK_SIZE
  playlistInfo: App.PlaylistInfo | null
  playlistTrackInfo: App.PlaylistTrackInfo | null
}

@Component({
  components: {
    ReleaseArtwork,
    PlaylistTrackTable,
    UserName,
    ContextMediaButton,
    FavoriteButton,
    ReleaseTotalTracks,
    ReleaseDuration,
    Followers,
    IntersectionLoadingCircle,
  },

  validate({ params }) {
    return params.playlistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const artworkSize = ARTWORK_SIZE;
    const [playlistInfo, playlistTrackInfo] = await Promise.all([
      await getPlaylistInfo(context, artworkSize),
      await getPlaylistTrackInfo(context, LIMIT_OF_TRACKS),
    ]);

    return {
      artworkSize,
      playlistInfo,
      playlistTrackInfo,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData {
  artworkSize: typeof ARTWORK_SIZE = ARTWORK_SIZE;
  playlistInfo: App.PlaylistInfo | null = null;
  playlistTrackInfo: App.PlaylistTrackInfo | null = null;

  head() {
    return {
      title: this.playlistInfo?.name ?? 'エラー',
    };
  }

  mounted() {
    if (this.playlistInfo?.artworkSrc != null) {
      this.$dispatch('extractDominantBackgroundColor', this.playlistInfo.artworkSrc);
    }
  }
  beforeDestroy() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  get isPlaylistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.playlistInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  /**
   * localPlugins の getTrackList と同じ処理で、スクロールが下限に到達したとき呼ばれる
   */
  async getTrackList() {
    if (this.playlistTrackInfo == null || this.playlistTrackInfo.isFullTrackList) return;

    const currentTrackList = this.playlistTrackInfo.trackList;
    const { playlistId } = this.$route.params;
    const offset = currentTrackList.length;
    const market = this.$getters()['auth/userCountryCode'];
    const tracks = await this.$spotify.playlists.getPlaylistItems({
      playlistId,
      limit: LIMIT_OF_TRACKS,
      offset,
      market,
    });
    if (tracks == null) {
      this.playlistTrackInfo.isFullTrackList = true;
      return;
    }

    const filteredTrackList = tracks.items
      .filter(({ track }) => track != null) as App.FilteredPlaylistTrack[];
    const trackIdList = filteredTrackList.map(({ track }) => track.id);
    const isTrackSavedList = await this.$spotify.library.checkUserSavedTracks({
      trackIdList,
    });
    const addedTrackList = filteredTrackList.map(convertPlaylistTrackDetail({
      isTrackSavedList,
      offset,
    }));
    this.playlistTrackInfo.trackList = [...currentTrackList, ...addedTrackList];

    if (tracks.next == null) {
      this.playlistTrackInfo.isFullTrackList = true;
    }
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.playlistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('player/play', this.isPlaylistSet
        ? undefined
        : { contextUri: this.playlistInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }

  async onFollowButtonClicked(nextFollowingState: OnFollowButton['on-clicked']) {
    const userId = this.$getters()['auth/userId'];
    if (this.playlistInfo == null || userId == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.playlistInfo.isFollowing = nextFollowingState;
    const playlistId = this.playlistInfo.id;
    if (nextFollowingState) {
      await this.$spotify.following.followPlaylist({ playlistId });
    } else {
      await this.$spotify.following.unfollowPlaylist({ playlistId });
    }

    // 実際の状態にする
    [this.playlistInfo.isFollowing] = await this.$spotify.following.checkUserFollowedPlaylist({
      playlistId,
      userIdList: [userId],
    });
  }

  onFavoriteTrackButtonClicked(row: OnTable['on-favorite-button-clicked']) {
    if (this.playlistTrackInfo == null) return;

    const nextTrackList = [...this.playlistTrackInfo.trackList];
    nextTrackList[row.index].isSaved = !row.isSaved;
    this.playlistTrackInfo = {
      ...this.playlistTrackInfo,
      trackList: nextTrackList,
    };
  }
}
</script>

<style lang="scss" module>
.PlaylistIdPage {
  padding: 16px 6% 48px;

  &__header {
    display: flex;
    margin-bottom: 32px;

    & > *:not(:last-child) {
      margin-right: 24px;
    }

    & > *:last-child {
      width: 100%;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__playlistName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }

  &__playlistInfoFooter {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    margin-top: 12px;
  }

  &__buttons {
    margin-right: 24px;

    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }

  &__playlistDetail {
    margin-top: 12px;

    & > *:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
