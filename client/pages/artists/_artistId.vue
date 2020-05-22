<template>
  <main :class="$style.ArtistIdPage">
    <div :class="$style.ArtistIdPage__header">
      <user-avatar
        :src="avatarSrc"
        :alt="avatarAlt"
        :size="220" />
      <div>
        <div :class="$style.ArtistIdPage__type">
          アーティスト
        </div>
        <h1 :class="$style.ArtistIdPage__artistName">
          {{ name }}
        </h1>
        <p>
          {{ followersText }}
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
import { SpotifyAPI } from '~~/types';
import { getImageSrc } from '~/scripts/parser/getImageSrc';
import { addComma } from '~~/utils/addComma';

export type AsyncData = {
  name: string
  id: string
  uri: string
  avatarSrc: string
  avatarAlt: string
  followersText: string
  isFollowing: boolean
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

  async asyncData({ app, params }): Promise<AsyncData | null> {
    const [artist, isFollowingList] = await Promise.all([
      app.$spotify.artists.getArtist({
        artistId: params.artistId,
      }),
      app.$spotify.following.checkUserFollowed({
        type: 'artist',
        idList: [params.artistId],
      }),
    ]);
    if (artist == null) return null;

    const isFollowing = isFollowingList != null
      ? isFollowingList[0]
      : false;
    const {
      name,
      id,
      uri,
      images,
      followers,
    } = artist;
    const avatarSrc = getImageSrc(images, 220);
    const avatarAlt = `the avatar of ${name}`;
    const followersText = `フォロワー ${addComma(followers.total)}人`;

    return {
      name,
      id,
      uri,
      avatarSrc,
      avatarAlt,
      followersText,
      isFollowing,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData {
  name = ''
  id = ''
  uri = ''
  avatarSrc = ''
  avatarAlt = ''
  images: SpotifyAPI.Image[] = []
  followersText = ''
  isFollowing = false

  head() {
    return {
      title: this.name,
    };
  }

  get isPlaying(): boolean {
    return this.$state().player.isPlaying;
  }
  get isArtistSet(): boolean {
    return this.$getters()['player/isArtistSet'](this.id);
  }

  onMediaControlButtonClicked(nextPlayingState: boolean) {
    if (nextPlayingState) {
      this.$dispatch('player/play', this.isArtistSet
        ? undefined
        : { contextUri: this.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }
  async onFollowButtonClicked(nextFollowingState: boolean) {
    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;
    const params = {
      type: 'artist' as const,
      idList: [this.id],
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
