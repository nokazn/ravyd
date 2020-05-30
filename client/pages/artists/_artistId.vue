<template>
  <page>
    <div
      :class="$style.ArtistIdPage"
      :style="styles"
    >
      <div
        v-if="artistInfo != null"
        :class="$style.ArtistIdPage__header"
      >
        <user-avatar
          :size="avatarSize"
          :src="artistInfo.avatarSrc"
          :alt="artistInfo.name"
          :title="artistInfo.name"
          default-user-icon="mdi-account-music"
          shadow
        />
        <div>
          <div
            title="認証済アーティスト"
            :class="$style.ArtistIdPage__type"
          >
            <span>
              アーティスト
            </span>
            <v-icon
              :size="14"
              color="light-blue"
              :class="$style.ArtistIdPage__verifiedIrtistIcon"
            >
              mdi-check-decagram
            </v-icon>
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
              @on-clicked="onMediaControlButtonClicked"
            />

            <follow-button
              :is-following="isFollowing"
              @on-clicked="onFollowButtonClicked"
            />
          </div>
        </div>
      </div>

      <section>
        <track-list-wrapper
          title="人気の曲"
          :omitted-length="5"
          :track-list="topTrackList"
          :uri="artistInfo.uri"
          :class="$style.ArtistIdPage__trackListSection"
        />
      </section>

      <template v-for="{ title, items } in Object.values(releaseListMap)">
        <cards-section
          v-if="items.length > 0"
          :key="title"
          :title="title"
          :class="$style.ArtistIdPage__cardSection"
        >
          <release-card
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            year-subtitle
          />
        </cards-section>
      </template>
    </div>
  </page>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootGetters } from 'vuex';

import Page from '~/components/globals/Page.vue';
import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import MediaControlButton from '~/components/parts/button/MediaControlButton.vue';
import FollowButton from '~/components/parts/button/FollowButton.vue';
import TrackListWrapper from '~/components/parts/wrapper/TrackListWrapper.vue';
import CardsSection from '~/components/parts/section/CardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import {
  getReleaseListMap,
  ArtistReleaseInfo,
  getArtistInfo,
  getTopTrackList,
  getIsFollowing,
} from '~/scripts/localPlugins/_artistId';
import { BACKGROUND_COLOR } from '~/variables';
import { App } from '~~/types';

export type AsyncData = {
  avatarSize: number
  topTrackArtworkSize: number
  releaseListMap: ArtistReleaseInfo | null
  artistInfo: App.ArtistInfo | null
  isFollowing: boolean
  topTrackList: App.TrackDetail[] | null
  listColor: typeof BACKGROUND_COLOR
}

@Component({
  components: {
    Page,
    UserAvatar,
    MediaControlButton,
    FollowButton,
    TrackListWrapper,
    CardsSection,
    ReleaseCard,
  },

  validate({ params }: Context) {
    return params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData | null> {
    const avatarSize = 220;
    const topTrackArtworkSize = 64;
    const [
      releaseListMap,
      artistInfo,
      isFollowing,
      topTrackList,
    ] = await Promise.all([
      getReleaseListMap(context, avatarSize),
      getArtistInfo(context, avatarSize),
      getIsFollowing(context),
      getTopTrackList(context, topTrackArtworkSize),
    ] as const);

    if (artistInfo != null) {
      context.app.$dispatch('extractDominantBackgroundColor', artistInfo.avatarSrc);
    }

    return {
      avatarSize,
      topTrackArtworkSize,
      releaseListMap,
      artistInfo,
      isFollowing,
      topTrackList,
      listColor: BACKGROUND_COLOR,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData {
  avatarSize = 220
  topTrackArtworkSize = 64
  releaseListMap: ArtistReleaseInfo | null = null
  artistInfo: App.ArtistInfo | null = null
  isFollowing = false
  topTrackList: App.TrackDetail[] | null = null
  listColor: typeof BACKGROUND_COLOR = BACKGROUND_COLOR

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  beforeDestroy() {
    this.$dispatch('resetBackgroundColor');
  }

  get styles(): RootGetters['backgroundStyles'] {
    return this.$getters().backgroundStyles;
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
    margin-bottom: 32px;
    & > *:not(:last-child) {
      margin-right: 24px
    }
  }

  &__type {
    font-size: 12px;
  }
  &__verifiedIrtistIcon {
    margin-bottom: 2px;
  }
  &__artistName {
    font-size: 40px;
    margin: 8px 0;
    line-height: 1.2em;
  }
  &__buttons > *:not(:last-child) {
    margin-right: 12px;
  }

  &__trackListSection {
    margin-bottom: 32px;
  }

  &__cardSection:not(:last-child) {
    margin-bottom: 32px;
  }
}
</style>
