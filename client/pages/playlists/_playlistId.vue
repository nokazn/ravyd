<template>
  <div :class="$style.PlaylistIdPage">
    <div :class="$style.PlaylistIdPage__header">
      <ReleaseArtwork
        :src="playlistInfo.artworkSrc"
        :alt="playlistInfo.name"
        :size="artworkSize"
        :title="playlistInfo.name"
        shadow
      />

      <div>
        <div class="g-small-text">
          プレイリスト
        </div>

        <h1 :class="$style.PlaylistIdPage__playlistName">
          {{ playlistInfo.name }}
        </h1>

        <UserName :user="playlistInfo.owner" />

        <div :class="$style.PlaylistIdPage__playlistInfoFooter">
          <div :class="$style.PlaylistIdPage__buttons">
            <ContextMediaButton
              :is-playing="isPlaying && isPlaylistSet"
              @on-clicked="onContextMediaButtonClicked"
            />

            <FavoriteButton
              v-if="playlistInfo.isFollowing != null"
              :is-favorited="playlistInfo.isFollowing"
              outlined
              @on-clicked="onFavoriteButtonClicked"
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
      v-if="trackList != null"
      :uri="playlistInfo.uri"
      :track-list="trackList"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import PlaylistTrackTable from '~/components/containers/table/PlaylistTrackTable.vue';
import UserName from '~/components/parts/text/UserName.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FavoriteButton, { On as OnFavoriteButton } from '~/components/parts/button/FavoriteButton.vue';
import ReleaseTotalTracks from '~/components/parts/text/ReleaseTotalTracks.vue';
import ReleaseDuration from '~/components/parts/text/ReleaseDuration.vue';
import Followers from '~/components/parts/text/Followers.vue';
import { getPlaylistInfo, getTrackList } from '~/scripts/localPlugins/_playlistId';
import { App } from '~~/types';

const ARTWORK_SIZE = 220;

interface AsyncData {
  artworkSize: typeof ARTWORK_SIZE
  playlistInfo: App.PlaylistInfo | null
  trackList: App.PlaylistTrackDetail[] | null
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
  },

  async asyncData(context) {
    const artworkSize = ARTWORK_SIZE;
    const [playlistInfo, trackList] = await Promise.all([
      await getPlaylistInfo(context, artworkSize),
      await getTrackList(context),
    ]);

    return {
      artworkSize,
      playlistInfo,
      trackList,
    };
  },
})
export default class PlaylistIdPage extends Vue implements AsyncData {
  artworkSize: typeof ARTWORK_SIZE = ARTWORK_SIZE;
  playlistInfo: App.PlaylistInfo | null = null;
  trackList: App.PlaylistTrackDetail[] | null = null;

  head() {
    return {
      title: this.playlistInfo?.name ?? 'エラー',
    };
  }

  get isPlaying(): boolean {
    return this.$state().player.isPlaying;
  }
  get isPlaylistSet(): boolean {
    return this.$state().player.contextUri === this.playlistInfo?.uri;
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

  async onFavoriteButtonClicked(nextFollowingState: OnFavoriteButton['on-clicked']) {
    const userId = this.$state().auth.userData?.id;
    if (this.playlistInfo == null || userId == null) return;

    // 先に表示を変える
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
}
</script>

<style lang="scss" module>
.PlaylistIdPage {
  padding: 16px 6% 48px;
  &__header {
    display: flex;
    align-items: flex-end;
    margin-bottom: 32px;
    & > *:not(:last-child) {
      margin-right: 24px;
    }
    & > *:last-child {
      width: 100%;
    }
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
