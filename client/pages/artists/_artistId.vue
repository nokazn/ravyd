<template>
  <div
    :class="$style.ArtistIdPage"
  >
    <div
      v-if="artistInfo != null"
      :class="$style.ArtistIdPage__header"
    >
      <UserAvatar
        :size="avatarSize"
        :src="artistInfo.avatarSrc"
        :alt="artistInfo.name"
        :title="artistInfo.name"
        default-user-icon="mdi-account-music"
        shadow
      />
      <div :class="$style.ArtistIdPage__info">
        <div title="認証済アーティスト">
          <span class="g-small-text">
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

        <p>{{ artistInfo.followersText }}</p>

        <div :class="$style.ArtistIdPage__buttons">
          <ContextMediaButton
            :is-playing="isArtistSet && isPlaying "
            @on-clicked="onContextMediaButtonClicked"
          />

          <FollowButton
            :is-following="isFollowing"
            @on-clicked="onFollowButtonClicked"
          />
        </div>
      </div>
    </div>

    <section v-if="artistInfo != null && topTrackList != null">
      <TrackListWrapper
        :abbreviated-length="ABBREVIATED_TOP_TRACK_LENGTH"
        :track-list="topTrackList"
        :uri="artistInfo.uri"
        title="人気の曲"
        :class="$style.ArtistIdPage__trackListSection"
        @on-favorite-button-clicked="onFavoriteTrackButtonClicked"
      />
    </section>

    <template v-for="{ title, items } in Object.values(releaseListMap)">
      <CardsSection
        v-if="items.length > 0"
        :key="title"
        :title="title"
      >
        <div
          :class="$style.ArtistIdPage__cardSection"
        >
          <ReleaseCard
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            :width="180"
            :max-width="240"
            year-subtitle
            :class="$style.ArtistIdPage__card"
          />

          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
          <div :class="$style.ArtistIdPage__cardSpacer" />
        </div>
      </CardsSection>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { RootState, RootMutations } from 'vuex';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import ContextMediaButton, { On as OnMediaButton } from '~/components/parts/button/ContextMediaButton.vue';
import FollowButton, { On as OnFollow } from '~/components/parts/button/FollowButton.vue';
import TrackListWrapper, { On as OnList } from '~/components/parts/wrapper/TrackListWrapper.vue';
import CardsSection from '~/components/parts/section/CardsSection.vue';
import ReleaseCard from '~/components/containers/card/ReleaseCard.vue';
import {
  getReleaseListMap,
  ArtistReleaseInfo,
  getArtistInfo,
  getTopTrackList,
  getIsFollowing,
} from '~/scripts/localPlugins/_artistId';
import { checkTrackSavedState } from '~/scripts/subscriber/checkTrackSavedState';
import { App } from '~~/types';

const AVATAR_SIZE = 220;
const ARTWORK_MAX_SIZE = 180;
const TOP_TRACK_ARTWORK_SIZE = 64;
const ABBREVIATED_TOP_TRACK_LENGTH = 5;

export type AsyncData = {
  avatarSize: number
  topTrackArtworkSize: number
  artistInfo: App.ArtistInfo | null
  isFollowing: boolean
  releaseListMap: ArtistReleaseInfo | null
  topTrackList: App.TrackDetail[] | null
}

export type Data = {
  mutationUnsubscribe: (() => void) | undefined
  ABBREVIATED_TOP_TRACK_LENGTH: typeof ABBREVIATED_TOP_TRACK_LENGTH
}

@Component({
  components: {
    UserAvatar,
    ContextMediaButton,
    FollowButton,
    TrackListWrapper,
    CardsSection,
    ReleaseCard,
  },

  validate({ params }: Context) {
    return params.artistId !== '';
  },

  async asyncData(context): Promise<AsyncData> {
    const artworkMaxSize = ARTWORK_MAX_SIZE;
    const avatarSize = AVATAR_SIZE;
    const topTrackArtworkSize = TOP_TRACK_ARTWORK_SIZE;
    const [
      releaseListMap,
      artistInfo,
      isFollowing,
      topTrackList,
    ] = await Promise.all([
      getReleaseListMap(context, artworkMaxSize),
      getArtistInfo(context, avatarSize),
      getIsFollowing(context),
      getTopTrackList(context, topTrackArtworkSize),
    ] as const);

    return {
      avatarSize,
      topTrackArtworkSize,
      releaseListMap,
      artistInfo,
      isFollowing,
      topTrackList,
    };
  },
})
export default class ArtistIdPage extends Vue implements AsyncData, Data {
  avatarSize = AVATAR_SIZE;
  topTrackArtworkSize = TOP_TRACK_ARTWORK_SIZE;
  releaseListMap: ArtistReleaseInfo | null = null;
  artistInfo: App.ArtistInfo | null = null;
  isFollowing = false;
  topTrackList: App.TrackDetail[] | null = null;

  mutationUnsubscribe: (() => void) | undefined = undefined;
  ABBREVIATED_TOP_TRACK_LENGTH: typeof ABBREVIATED_TOP_TRACK_LENGTH = ABBREVIATED_TOP_TRACK_LENGTH;

  head() {
    return {
      title: this.artistInfo?.name ?? 'エラー',
    };
  }

  get isArtistSet(): boolean {
    return this.$getters()['player/isContextSet'](this.artistInfo?.uri);
  }
  get isPlaying(): RootState['player']['isPlaying'] {
    return this.$state().player.isPlaying;
  }

  mounted() {
    this.$dispatch('setDefaultDominantBackgroundColor');

    this.mutationUnsubscribe = this.$store.subscribe((mutation) => {
      if (this.topTrackList == null) return;

      const type = mutation.type as keyof RootMutations;
      if (type !== 'library/tracks/SET_ACTUAL_IS_SAVED') return;

      const topTrackList = checkTrackSavedState<App.TrackDetail>(mutation as {
        type: typeof type
        payload: RootMutations[typeof type]
      }, this.$commit)(this.topTrackList);

      this.topTrackList = topTrackList;
    });
  }
  beforeDestroy() {
    this.$dispatch('resetDominantBackgroundColor');

    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  }

  onContextMediaButtonClicked(nextPlayingState: OnMediaButton['on-clicked']) {
    if (this.artistInfo == null) return;

    if (nextPlayingState) {
      this.$dispatch('player/play', this.isArtistSet
        ? undefined
        : { contextUri: this.artistInfo.uri });
    } else {
      this.$dispatch('player/pause');
    }
  }

  async onFollowButtonClicked(nextFollowingState: OnFollow['on-clicked']) {
    if (this.artistInfo == null) return;

    // API との通信の結果を待たずに先に表示を変更させておく
    this.isFollowing = nextFollowingState;

    const artistIdList = [this.artistInfo.id];
    if (nextFollowingState) {
      await this.$dispatch('library/artists/followArtists', artistIdList);
    } else {
      await this.$dispatch('library/artists/unfollowArtists', artistIdList);
    }

    [this.isFollowing] = await this.$spotify.following.checkUserFollowed({
      type: 'artist',
      artistIdList,
    });
  }

  onFavoriteTrackButtonClicked({ index, nextSavedState }: OnList['on-favorite-button-clicked']) {
    if (this.topTrackList == null) return;

    const topTrackList = [...this.topTrackList];
    topTrackList[index].isSaved = nextSavedState;
    this.topTrackList = topTrackList;
  }
}
</script>

<style lang="scss" module>
.ArtistIdPage {
  padding: 16px 6% 48px;

  &__cardSection {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    // card と cardSpacer 両方に適用
    & > * {
      margin-left: 16px;
      margin-right: 16px;
      flex: 1 0 180px;
      min-width: 180px;
      max-width: 240px;
    }

    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }

  &__header {
    display: flex;
    margin-bottom: 32px;

    & > *:not(:last-child) {
      margin-right: 24px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
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

  &__card {
    margin-bottom: 32px;
  }

  // 最終行の余りの部分を埋める
  &__cardSpacer {
    height: 0;
  }
}
</style>
