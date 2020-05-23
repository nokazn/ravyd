<template>
  <main :class="$style.ArtistIdPage">
    <div
      v-if="artistInfo != null"
      :class="$style.ArtistIdPage__header">
      <user-avatar
        :src="artistInfo.avatarSrc"
        :alt="artistInfo.avatarAlt"
        :size="220"
        default-user-icon="mdi-account-music" />
      <div>
        <div :class="$style.ArtistIdPage__type">
          アーティスト
        </div>
        <h1 :class="$style.ArtistIdPage__artistName">
          {{ artistInfo.name }}
        </h1>
        <p>
          {{ artistInfo.followersText }}
        </p>

        <div :class="$style.ArtistIdPage__buttons">
          <media-control-button
            :is-playing="isPlaying && isArtistSet"
            @on-clicked="onMediaControlButtonClicked" />

          <follow-button
            :is-following="isFollowing"
            @on-clicked="onFollowButtonClicked" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import MediaControlButton from '~/components/parts/button/MediaControlButton.vue';
import FollowButton from '~/components/parts/button/FollowButton.vue';
import {
  getArtistInfo,
  ArtistInfo,
  getTopTrackList,
  TrackDetail,
  getIsFollowing,
} from '~/scripts/localPlugins/_artistId';


export type AsyncData = {
  artistInfo: ArtistInfo | null
  isFollowing: boolean
  topTrackList: TrackDetail[] | null
}

@Component({
  components: {
    UserAvatar,
    MediaControlButton,
    FollowButton,
  },

  validate({ params }: Context) {
    return params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData | null> {
    const [artistInfo, isFollowing, topTrackList] = await Promise.all([
      getArtistInfo(context),
      getIsFollowing(context),
      getTopTrackList(context),
    ] as const);

    return {
      artistInfo,
      isFollowing,
      topTrackList,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData {
  artistInfo: ArtistInfo = {
    name: '',
    id: '',
    uri: '',
    avatarSrc: '',
    avatarAlt: '',
    followersText: '',
  }
  isFollowing = false
  topTrackList: TrackDetail[] | null = null

  head() {
    return {
      title: this.artistInfo.name,
    };
  }

  get isPlaying(): boolean {
    return this.$state().player.isPlaying;
  }
  get isArtistSet(): boolean {
    return this.artistInfo != null
      ? this.$getters()['player/isArtistSet'](this.artistInfo.id)
      : false;
  }

  onMediaControlButtonClicked(nextPlayingState: boolean) {
    if (this.artistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('player/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artistInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }
  async onFollowButtonClicked(nextFollowingState: boolean) {
    if (this.artistInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;
    const params = {
      type: 'artist' as const,
      idList: [this.artistInfo.id],
    };
    if (nextFollowingState) {
      await this.$spotify.following.follow(params);
    } else {
      await this.$spotify.following.unfollow(params);
    }
    // @todo
    [this.isFollowing] = await this.$spotify.following.checkUserFollowed(params);
  }
}
</script>

<style lang="scss" module>
.ArtistIdPage {
  padding: 16px 6% 48px;
  &__header {
    display: flex;
    align-items: flex-end;
    & > *:not(:last-child) {
      margin-right: 24px
    }
  }

  &__type {
    font-size: 10px;
  }
  &__artistName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }
  &__buttons > *:not(:last-child) {
    margin-right: 12px;
  }
}
</style>
